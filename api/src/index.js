import server from './server.js'
import db from './services/db.js'
import config from '../config.js'

db.connect()
db.instance.once('open', async () => {
	console.log('Connected to MongoDB')
	server.emit('ready')
})

server.on('ready', () => server.listen(
	config.apiPort,
	() => console.log(`API Server started on port ${config.apiPort}`)
))

server.on('error', error => console.error(error))