import session from 'express-session'
import express from 'express'
import compression from 'compression'
import helmet from 'helmet'
import { webpack } from 'webpack'
import cookieParser from 'cookie-parser'
import passport from 'passport'
import path from 'path'

import rateLimiterMiddleware from './util/rateLimiterMiddleware.js'
import webpackClientConfig from '../webpack.client.config.cjs'

import serverConfig from './serverConfig.js'
import config from './config.js'
import auth from './containers/auth.js'
import db from './containers/db.js'

const assets = {
	bundle: '/assets/js/bundle.js',
	styles: '/assets/css/styles.css'
}

const app = express()

if (app.get('env') === 'development') {
	const compiler = webpack(webpackClientConfig)
	
	let initialCompile = true
	
	compiler.hooks.done.tap('VersaCompiler', stats => {
		if (initialCompile !== true) console.log('refreshing client...')
		
		initialCompile = false
		
		return true
	})
	
	// Webpack watcher
	app.use(require('webpack-dev-middleware')(compiler, {
		publicPath: webpackClientConfig.output.publicPath,
		writeToDisk: true,
		stats: 'none'
	}))
	
	// Socket server
	app.use(require('webpack-hot-middleware')(compiler, {
		log: false,
		path: '/__hot-reload',
		heartbeat: 1 * 1000
	}))
}

app.disable('x-powered-by')
app.use(express.json())
app.use(express.static(path.resolve(__dirname, '../public')))
app.use(express.urlencoded({extended: true}))
app.use(compression())
app.use(cookieParser())
app.disable('x-powered-by')
app.use((_, res, next) => {
	res.header('Access-Control-Allow-Credentials', 'true')
	next()
})

if (config.dev) {
	app.use((req, res, next) => {
		res.header('Access-Control-Allow-Origin', config.domain)
		res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept')
		next()
	})
} else {
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
	app.use(helmet({ noCache: config.dev }))
	
	app.set('trust proxy', 1) // trust first proxy
}

db.connect()
db.instance.once('open', () => {
	app.use(session({
		name: config.shortName.session,
		secret: config.expressSecret,
		cookie: {
			maxAge: serverConfig.maxTokenAge,
			// serve secure cookies in production
			secure: !config.dev,
			sameSite: 'strict'
		},
		httpOnly: true,
		resave: false,
		saveUninitialized: false,
		store: db.getStore() // TODO: Convert to REST API store (https://www.npmjs.com/package/restsession)
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
		theme_color: config.brandColor,
		background_color: '#ffffff',
		share_target: {
			action: '/share',
			method: 'GET',
			enctype: 'application/x-www-form-urlencoded',
			params: {
				title: 'title',
				text: 'text',
				url: 'url'
			}
		}
	}))
	
	/* Route all other traffic to React Renderer */
	app.get(/^\/(?!auth).*/, async (req, res) => {
		res.write(
`<!DOCTYPE html>
<head>
<link href="${assets.styles}" rel="stylesheet">
</head>
<body>
	<div id="root"></div>
	<script>assetManifest=${JSON.stringify(assets)};</script>
	<script src="${assets.bundle}"></script>
</body>`)
		res.end()
	})
	
	app.emit('ready')
})

app.on('ready', () => app.listen(
	config.port,
	() => console.log(`server started on port ${config.port}`)
))

app.on('error', error => console.error(error))

export default app