import express from 'express'
import compression from 'compression'
import helmet from 'helmet'
import cookieParser from 'cookie-parser'
import path from 'path'
import { fileURLToPath } from 'url'

import rateLimiterMiddleware from './util/rateLimiterMiddleware.js'
import apiMiddleware from './util/apiMiddleware.js'

import useAPI from './containers/routes.js'
import config from '../config.js'
import oauth from './services/auth/oauth.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = express()

app.disable('etag')
app.disable('x-powered-by')
app.use(express.json())
app.use(express.static(path.resolve(__dirname, '../public')))
app.use(express.urlencoded({extended: true}))
app.use(compression())
app.use(cookieParser())
app.use(apiMiddleware())
app.use(oauth.inject(app))

if (config.dev) {
	app.use((req, res, next) => {
		res.header('Access-Control-Allow-Origin', config.domain)
		res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization')
		next()
	})
} else {
	app.use(rateLimiterMiddleware)
	
	app.use((req, res, next) => {
		req.secure ? next() : res.sendStatus(505)
	})
	
	/* Setup helmet */
	app.use(helmet.contentSecurityPolicy({
		directives: {
			defaultSrc: ["'self'"],
			styleSrc: ["'self'", config.apiDomain],
			scriptSrc: ["'self'", config.apiDomain]
		}
	}))
	app.use(helmet.referrerPolicy({ policy: 'no-referrer' }))
	app.use(helmet.frameguard({ action: 'deny' }))
	app.use(helmet({ noCache: config.dev }))
	
	app.set('trust proxy', 1) // trust first proxy
}

app.use((req, res, next) => {
	res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE')
	res.header('Access-Control-Allow-Credentials', true)
	res.header('Access-Control-Max-Age', 86400)
	
	// Chrome preflight request
	if (req.method === 'OPTIONS') return res.sendStatus(200)
	
	next()
})

app.use('/oauth', oauth.use(app))
app.use('/v1', useAPI(app))

// Log all requests and their fields
if (config.dev) app.use((req, res, next) => {
	console.log(req.url, req.fields)
	next()
})

app.get

app.get('*', (req, res) => res.status(404).send())

app.use((error, req, res) => {
	if (error) {
		if (config.dev) console.error(error.stack)
		return res.status(500).send()
	}
})

export default app