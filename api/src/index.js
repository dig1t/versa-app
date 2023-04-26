import http2 from 'node:http2'

import server from './server.js'
import db from './services/db.js'
import config from '../config.js'
import useClusters from './util/useClusters.js'

useClusters(() => {
	db.connect()
	db.instance.once('open', async () => {
		console.log('db connection success')
		server.emit('ready')
	})
	
	const httpServer = http2.createServer(server)
	
	server.on('ready', () => {
		httpServer.listen(config.apiPort)
	})
	server.on('error', (error) => console.error(error))
})