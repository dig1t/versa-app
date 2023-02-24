import express from 'express'
import compression from 'compression'
import helmet from 'helmet'
import cookieParser from 'cookie-parser'

import rateLimiterMiddleware from './util/rateLimiterMiddleware.js'
import apiMiddleware from './util/apiMiddleware.js'

import useAPI from './containers/routes.js'
import config from '../../config.js'
import oauth from './services/auth/oauth.js'

const app = express()

app.use(express.json())
app.use(express.static('dist/public'))
app.use(express.urlencoded({extended: true}))
app.use(compression())
app.use(cookieParser())
app.disable('etag')
app.disable('x-powered-by')
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
	res.header('Access-Control-Allow-Credentials', true)
	res.header('Access-Control-Max-Age', 86400)
	
	// Chrome preflight request
	if (req.method === 'OPTIONS') return res.sendStatus(200)
	
	next()
})

app.use('/oauth', oauth.use(app))
app.use('/v1', useAPI(app))

export default app