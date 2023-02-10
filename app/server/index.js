import session from 'express-session'
import express from 'express'
import compression from 'compression'
import helmet from 'helmet'
import { webpack } from 'webpack'
import cookieParser from 'cookie-parser'
import passport from 'passport'

import { rateLimiterMiddleware, asyncMiddleware } from './util/index.js'
import webpackServerConfig from '../webpack.client.config.js'
import config from '../../config.js'
import auth from './containers/auth.js'
import db from './containers/db.js'
import useRequire from './util/require.cjs'

const app = express()

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

app.use(cookieParser())
app.use(express.json())
app.use(express.static('dist/public'))
app.use(express.urlencoded({extended: true}))
app.use(compression())
app.use((_, res, next) => {
	res.header('Access-Control-Allow-Credentials', 'true')
	next()
})

if (app.get('env') === 'production') {
	app.use(rateLimiterMiddleware)
	
	/* Setup helmet */
	app.use(helmet.contentSecurityPolicy({
		directives: {
			defaultSrc: ["'self'"],
			styleSrc: ["'self'", config.domain],
			scriptSrc: ["'self'", config.domain]
		}
	}))
	app.use(helmet.referrerPolicy({ policy: 'no-referrer' }))
	app.use(helmet.frameguard({ action: 'deny' }))
	app.use(helmet({ noCache: app.get('env') === 'development' }))
	
	app.set('trust proxy', 1) // trust first proxy
}

db.connect()
db.instance.once('open', () => {
	app.use(session({
		name: 'vs',
		secret: config.expressSecret,
		cookie: {
			expires: new Date().setMonth(new Date().getMonth() + 18),
			// serve secure cookies in production
			secure: process.env.NODE_ENV === 'production',
			sameSite: 'strict'
		},
		httpOnly: true,
		resave: false,
		saveUninitialized: true,
		store: db.getStore()
	}))
	
	app.use(passport.initialize())
	app.use(passport.session())
	
	app.use('/', auth)
	
	/* PWA manifest file */
	app.get('/manifest.json', (_, res) => res.send({
		name: config.appName,
		short_name: config.appName,
		description: config.appDescription,
		start_url: '/login',
		display: 'standalone',
		orientation: 'portrait',
		theme_color: config.theme_color,
		background_color: '#ffffff',
		share_target: {
			action: '/share',
			method: 'GET',
			enctype: 'multipart/form-data',
			params: {
				title: 'title',
				text: 'text',
				url: 'url'
			}
		}
	}))
	
	/* Route all other traffic to React Renderer */
	app.get(/^\/(?!auth).*/, asyncMiddleware(async (req, res) => await useRequire(req, res)))
	
	app.emit('ready')
})

app.on('ready', () => app.listen(
	config.port,
	() => console.log(`Server started on port ${config.port}`)
))

app.on('error', err => console.error(err))

export default app