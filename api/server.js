import express from 'express'
import compression from 'compression'
import helmet from 'helmet'

import { rateLimiterMiddleware, apiMiddleware } from './util'

import routes from './containers/routes'

const app = express()

/* Setup express */
app.use(express.json())
app.use(express.static('dist/public'))
app.use(express.urlencoded({extended: true}))
app.use(compression())
app.use(apiMiddleware())

if (app.get('env') == 'development') {
	app.use((req, res, next) => {
		res.header('Access-Control-Allow-Origin', '*')
		res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept')
		next()
	})
}

if (app.get('env') === 'production') {
	app.use(rateLimiterMiddleware)
	
	/* Setup helmet */
	app.use(helmet.contentSecurityPolicy({
		directives: {
			defaultSrc: ["'self'"],
			styleSrc: ["'self'", 'https://versa.dig1t.io'],
			scriptSrc: ["'self'", 'https://versa.dig1t.io']
		}
	}))
	app.use(helmet.referrerPolicy({ policy: 'no-referrer' }))
	app.use(helmet.frameguard({ action: 'deny' }))
	app.use(helmet({ noCache: app.get('env') === 'development' }))
	
	app.set('trust proxy', 1) // trust first proxy
}

app.use('/v1', routes)

app.get('*', (_, res) => res.apiResult(404))

export default app