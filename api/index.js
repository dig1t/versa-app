import server from './src/server'
import db from './src/services/db'
//import openid from './src/services/auth/openid'
import oauth from './src/services/auth/oauth'
import config from '../config'

server.oauth = new oauth()

server.use(server.oauth.inject())

db.connect()
db.instance.once('open', async () => {
	await server.oauth.inject(server)
	
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

server.get('*', (_, res) => res.sendStatus(404))