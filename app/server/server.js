import session from 'express-session'
import express from 'express'
import compression from 'compression'
import helmet from 'helmet'
import cookieParser from 'cookie-parser'
import MongoStore from 'connect-mongo'
import passport from 'passport'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

import { APIError, errorMiddleware } from './util/apiError.js'
import rateLimiterMiddleware from './middleware/rateLimiterMiddleware.js'
import serverConfig from './constants/serverConfig.js'
import config from './config.js'

import authRoutes from './routes/authRoutes.js'
import coreRoutes from './routes/coreRoutes.js'
import hotReload from './middleware/hotReload.js'

const app = express()

hotReload(app)

app.disable('x-powered-by')
app.use(express.json())
app.use(express.static(path.resolve(__dirname, '../public')))
app.use(express.urlencoded({extended: true}))
app.use(compression())
app.use(cookieParser())
app.disable('x-powered-by')

app.use((req, res, next) => {
	res.header('Access-Control-Allow-Methods', 'GET, POST')
	res.header('Access-Control-Allow-Credentials', 'true')
	res.header('Access-Control-Max-Age', 86400)
	
	// Handle Google Chrome preflight requests
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

app.use('/', authRoutes)
app.use('/', coreRoutes)

app.use(errorMiddleware)

export default app