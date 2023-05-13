import server from './server.js'
import db from './services/db.js'
import config from '../config.js'
import useClusters from './util/useClusters.js'

useClusters(() => {
	db.connect()
	db.instance.once('open', async () => {
		console.log('database connection success')
		server.emit('ready')
	})
	
	server.on('ready', () => {
		console.log(`starting API at http://localhost:${config.apiPort}`)
		server.listen(config.apiPort)
	})
	server.on('error', (error) => console.log(error))
})