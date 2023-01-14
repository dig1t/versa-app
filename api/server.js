import express from 'express'
import compression from 'compression'
import helmet from 'helmet'
import mongoose from 'mongoose'

import { rateLimiterMiddleware } from './util'

import config from '../config'

import routes from './containers/routes'
import statusMessage from './constants/statusMessage'

const app = express()

/* Setup mongoose */
const db = mongoose.connection

mongoose.set('strictQuery', false)
mongoose.Promise = global.Promise

db.on('error', console.error.bind(console, 'MongoDB Error:'))
db.once('open', () => {
	console.log('Connected to MongoDB')
})

/* Setup express */
app.use(express.json())
app.use(express.static('dist/public'))
app.use(express.urlencoded({extended: true}))
app.use(compression())

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

app.use((req, res, next) => {
	res.apiResult = (status, data) => res.status(status || 200).send({
		success: status === 200,
		data,
		message: data && data.message !== undefined && (
			// if resulting message is a thrown error, convert it to a string
			(typeof(data.message) === 'string') ? data.message : data.message.toString()
		) || statusMessage[status] // if no message, give a status message
	})
	
	res.getFields = (query, respondToClient) => {
		const data = (
			typeof req.body.data !== 'undefined' && (req.body.data.data || req.body.data)
		) || req.query.data || req.query
		
		if (!data) return respondToClient && res.status(400).send({
			message: 'Missing fields'
		}) && false
		
		req.fields = {}
		
		for (let field in query) {
			if (data[query[field]] === undefined)
				return respondToClient && res.status(400).send({
					message: `Missing field: ${query[field]}`
				}) && false
			
			req.fields[query[field]] = data[query[field]]
		}
		
		return true
	}
	
	next()
})

app.use('/v1', routes)

app.get('*', (_, res) => res.apiResult(404))

app.listen(config.apiPort, () => {
	console.log(`API Server started on port ${config.apiPort}`)
	mongoose.connect(config.db, { useNewUrlParser: true })
})

app.on('error', err => console.error(err))