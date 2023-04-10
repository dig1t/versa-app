import cluster from 'node:cluster'
import { availableParallelism } from 'node:os'

import server from './server.js'
import db from './services/db.js'
import config from '../config.js'

if (cluster.isPrimary) {
	console.log(`[versa-api] primary ${process.pid} is running`)
	
	const availableCPUs = availableParallelism()
	
	for (let i = 0; i < availableCPUs; i++) {
		cluster.fork()
	}
	
	cluster.on('exit', (worker, code) => {
		console.log(`[versa-api] worker ${worker.process.pid} died with code ${code}`)
	})
} else {
	db.connect()
	db.instance.once('open', async () => {
		server.emit('ready')
	})
	
	server.on('ready', () => server.listen(config.apiPort))
	server.on('error', error => console.error(error))
}