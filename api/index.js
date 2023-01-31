import server from './server'
import db from './containers/db'
import config from '../config'

db.connect()
db.instance.once('open', () => {
	console.log('Connected to MongoDB')
	server.emit('ready')
})

// Log all requests and their fields
server.use((req, res, next) => {
	console.log(req.url, req.fields)
	next()
})

server.on('ready', () => server.listen(
	config.apiPort,
	() => console.log(`API Server started on port ${config.apiPort}`)
))

server.on('error', err => console.error(err))