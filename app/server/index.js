/* eslint-disable no-undef */
import cluster from 'node:cluster'
import { availableParallelism } from 'node:os'
import http2 from 'node:http2'
import { readFileSync } from 'fs'
import path from 'node:path'

import server from './server.js'
import config from './config.js'

const USE_CLUSTERS = false

console.log(`starting HTTP server at http://localhost:${config.devPort}`)

if (cluster.isPrimary && USE_CLUSTERS) {
	console.log(`primary ${process.pid} is running`)
	
	const availableCPUs = availableParallelism()
	
	for (let i = 0; i < availableCPUs; i++) {
		cluster.fork()
	}
	
	cluster.on('exit', (worker, code) => {
		console.log(`worker ${worker.process.pid} died with code ${code}`)
	})
} else if (process.env.APP_ENV === 'development') {
	server.on('ready', () => {
		server.listen(config.devPort)
	})
	
	server.on('error', error => console.error(error))
} else {
	const httpServerOptions = {
		key: readFileSync(path.resolve(__dirname, process.env.APP_SSL_KEY)),
		cert: readFileSync(path.resolve(__dirname, process.env.APP_SSL_CERT))
	}
	
	// Redirect HTTP traffic to HTTPS
	const httpServer = http2.createServer((req, res) => {
		res.writeHead(
			301,
			{ Location: `https://${req.headers.host}${req.url}` }
		)
		res.end()
	})
	
	const httpsServer = http2.createSecureServer(httpServerOptions, server)
	
	server.on('ready', () => {
		httpServer.listen(80)
		httpsServer.listen(443)
	})
	
	server.on('error', error => console.error(error))
}