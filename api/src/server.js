// eslint-disable-next-line @typescript-eslint/no-var-requires
//require('fix-esm').register()

import express from 'express'
import compression from 'compression'
import helmet from 'helmet'
import cookieParser from 'cookie-parser'

import { rateLimiterMiddleware, apiMiddleware } from './util'

import routes from './containers/routes'
import config from '../../config'

const app = express()

/* Setup express */
app.use(express.json())
app.use(express.static('dist/public'))
app.use(express.urlencoded({extended: true}))
app.use(compression())
app.use(apiMiddleware())
app.use(cookieParser())

if (config.dev) {
	app.use((req, res, next) => {
		res.header('Access-Control-Allow-Origin', config.domain)
		res.header('Access-Control-Allow-Credentials', true)
		res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept')
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
			styleSrc: ["'self'", config.domain],
			scriptSrc: ["'self'", config.domain]
		}
	}))
	app.use(helmet.referrerPolicy({ policy: 'no-referrer' }))
	app.use(helmet.frameguard({ action: 'deny' }))
	app.use(helmet({ noCache: dev }))
	
	app.set('trust proxy', 1) // trust first proxy
}

app.use('/v1', routes)

export default app