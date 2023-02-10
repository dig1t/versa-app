import server from './src/server.js'
import db from './src/services/db.js'
import config from '../config.js'

db.connect()
db.instance.once('open', async () => {
	server.get('*', (_, res) => res.sendStatus(404))
	
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