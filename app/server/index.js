import express from 'express'
import session from 'express-session'
import compression from 'compression'
import helmet from 'helmet'
import mongoose from 'mongoose'
import MongoStore from 'connect-mongo'
import sanitize from 'mongo-sanitize'
import passport from 'passport'
import { webpack } from 'webpack'
import { Strategy as LocalStrategy } from 'passport-local'

import config from '../../config'
import webpackServerConfig from '../webpack.client.config'
import useRequire from './require.cjs'

import User from '../src/models/User'
import axios from 'axios'

const app = express()

const API_BASE = 'http://127.0.0.1:81/v1'

/* Setup mongoose */
const db = mongoose.connection

const asyncMiddleware = fn => (req, res, next) => {
	Promise.resolve(fn(req, res, next))
		.catch(next)
}

mongoose.connect(config.appDB, { useNewUrlParser: true })
mongoose.Promise = global.Promise

/* Setup express */

if (app.get('env') === 'development') {
	const compiler = webpack(webpackServerConfig)
	
	app.use(require('webpack-dev-middleware')(compiler, {
		publicPath: webpackServerConfig.output.publicPath
	}))
	app.use(require('webpack-hot-middleware')(compiler, {
		log: false,
		path: '/__webpack_hmr',
		heartbeat: 10 * 1000
	}))
}

app.use(express.json())
app.use(express.static('dist/public'))
app.use(express.urlencoded({extended: true}))
app.use(compression())
app.set('view engine', 'ejs')
app.set('views', 'server/views')

app.on('error', err => {
	if (err) console.error(err)
	
	console.log(`Server started on port ${config.port}`)
})

if (app.get('env') === 'production') {
	app.use(helmet({ noCache: app.get('env') === 'development' }))
	app.set('trust proxy', 1) // trust first proxy
}

db.on('error', console.error.bind(console, 'MongoDB Error:'))
db.once('open', () => {
	console.log('Connected to MongoDB')

	/* Setup express-session */
	app.use(session({
		name: '_sid',
		secret: config.expressSecret,
		cookie: {
			expires: new Date().setMonth(new Date().getMonth() + 18),
			// serve secure cookies in production
			secure: app.get('env') === 'production' ? true : false
		},
		resave: true,
		saveUninitialized: true,
		store: MongoStore.create({ client: mongoose.connection.getClient() })
	}))
	
	/* Setup passport.js */
	app.use(passport.initialize())
	app.use(passport.session()) // must be run after express-session
	
	passport.use('local', new LocalStrategy(
		{usernameField: 'email'},
		async (email, password, done) => {
			try {
				axios({
					method: 'post',
					url: API_BASE + '/user/authenticate',
					data: {
						email: sanitize(email),
						password
					}
				})
					.then(response => {
						console.log(response)
					})
					.catch(e => done(e))
			} catch(e) {
				done(e)
			}
		}
	))
	
	passport.serializeUser((user, done) => done(null, user._id))
	
	passport.deserializeUser((id, done) => {
		User.findById(id)
			.then(user => done(null, user))
			.catch(err => done(err))
	})
})

/* PWA manifest file */
app.get('/manifest.json', (req, res) => {
	return res.send({
		name: config.meta.title,
		short_name: config.name,
		description: config.meta.description,
		start_url: '/login',
		display: 'standalone',
		orientation: 'portrait',
		theme_color: config.theme_color,
		background_color: '#ffffff'
	})
})

/* Hook authentication routes */
app.post('/login', (req, res, next) => {
	passport.authenticate('local', function(err, user, message) {
		if (err) {
			return next(err)
		} else if (!user) {
			// user not authenticated
			return res.send({ success: false, message })
		}
		
		// user authenticated, establish session with req.logIn()
		req.logIn(user, err => {
			if (err) return next(err)
			
			const { userId, isAdmin, isMod } = user
			
			req.session.userId = userId
			req.session.isAdmin = isAdmin
			req.session.isMod = isMod
			
			return res.send({ success: true })
		})
	})(req, res, next)
})

app.get('/logout', (req, res) => {
	req.logout()
	req.session.destroy()
	res.redirect('/')
})

/* Route all other traffic to React Renderer */
app.get('*', asyncMiddleware(async (req, res) => await useRequire(req, res)))

app.on('ready', () => {
	console.log('app ready!')
})
app.listen(config.port)

export default app