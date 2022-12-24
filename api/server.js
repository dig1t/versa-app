import express from 'express'
import compression from 'compression'
import helmet from 'helmet'
import mongoose from 'mongoose'

import config from '../config'

import routes from './containers/routes'
import statusMessage from './constants/statusMessage'

const app = express()

/* Setup mongoose */
const db = mongoose.connection

mongoose.connect(config.db, { useNewUrlParser: true })
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

if (app.get('env') === 'production') {
	app.use(helmet({ noCache: app.get('env') === 'development' }))
	app.set('trust proxy', 1) // trust first proxy
}

app.use((_, res, next) => {
	res.apiResult = (status, data) => res.status(status || 200).send({
		success: status === 200,
		...data || {},
		message: data && data.message !== undefined && (
			// if resulting message is a thrown error, convert it to a string
			(typeof(data.message) === 'string') ? data.message : data.message.toString()
		) || statusMessage[status] // if no message, give a status message
	})
	
	res.checkForFields = (query, respondToClient) => {
		for (let field in query) {
			if (query[field] === null) return respondToClient && res.status(400).send({
				message: 'Missing fields'
			}) && false
		}
		
		return true
	}
	
	next()
})

app.use('/v1', routes)

app.on('error', err => {
	if (err) console.error(err)
	
	console.log(`Server started on port ${config.port}`)
})

app.get('*', (_, res) => res.apiResult(404))

app.listen(81, () => {
	console.log('API Server Started')
})