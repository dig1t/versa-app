import session from 'express-session'
import express from 'express'
import compression from 'compression'
import helmet from 'helmet'
import webpack from 'webpack'
import WebpackHotMiddleware from 'webpack-hot-middleware'
import WebpackDevMiddleware from 'webpack-dev-middleware'
import cookieParser from 'cookie-parser'
import passport from 'passport'
import path from 'path'
import { fileURLToPath } from 'url'
import MongoStore from 'connect-mongo'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
import rateLimiterMiddleware from './util/rateLimiterMiddleware.js'
import webpackClientConfig from '../webpack.client.config.cjs'

import { APIError, errorMiddleware } from './util/apiError.js'
import serverConfig from './serverConfig.js'
import config from './config.js'
import auth from './services/auth.js'

const assets = {
	bundle: '/assets/client/bundle.js',
	styles: '/assets/client/styles.css'
}

const app = express()

if (app.get('env') === 'development') {
	const compiler = webpack(webpackClientConfig)
	
	let initialCompile = true
	
	compiler.hooks.done.tap('VersaCompiler', () => {
		if (initialCompile !== true) console.log('refreshing client...')
		
		initialCompile = false
		
		return true
	})
	
	// Webpack watcher
	app.use(WebpackDevMiddleware(compiler, {
		publicPath: webpackClientConfig.output.publicPath,
		writeToDisk: true,
		stats: 'none'
	}))
	
	// Socket server
	app.use(WebpackHotMiddleware(compiler, {
		log: false,
		path: '/__hot-reload',
		heartbeat: 1 * 1000
	}))
}

app.disable('x-powered-by')
app.use(express.json())
app.use(express.static(path.resolve(__dirname, '../../app/public')))
app.use(express.urlencoded({extended: true}))
app.use(compression())
app.use(cookieParser())
app.disable('x-powered-by')
app.use((req, res, next) => {
	res.header('Access-Control-Allow-Methods', 'GET, POST')
	res.header('Access-Control-Allow-Credentials', 'true')
	res.header('Access-Control-Max-Age', 86400)
	
	// Chrome preflight request
	if (req.method === 'OPTIONS') return res.sendStatus(200)
	
	req.on('aborted', () => {
		next(new APIError('Request aborted by the client', 400, {
			requestAborted: true
		}))
	})
	
	next()
})

if (config.dev) {
	app.use((req, res, next) => {
		res.header('Access-Control-Allow-Origin', req.headers.origin)
		res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept')
		next()
	})
} else {
	app.use(rateLimiterMiddleware)
	//res.header('Access-Control-Allow-Origin', config.domain)
	
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
	store: MongoStore.create({
		mongoUrl: config.sessionDatabaseURI,
		dbName: 'sessions'
	})
}))

app.use(passport.initialize())
app.use(passport.session())

app.use('/', auth)

/* PWA manifest file */
app.get('/manifest.json', (_, res) => res.json(serverConfig.manifest))

app.get('/robots.txt', (_, res) => res.send('Disallow: *'))

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

app.use(errorMiddleware)

export default app