import http2 from 'node:http2'
import path from 'node:path'
import { readFileSync } from 'fs'
import { fileURLToPath } from 'url'

import server from './server.js'
import config from './config.js'
import useClusters from './util/useClusters.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const httpOptions = {
	allowHTTP1: true
}

useClusters(() => {
	if (process.env.APP_ENV === 'development') {
		console.log(`starting server at http://localhost:${config.port}`)
		server.listen(config.port)
	} else {
		const httpServerOptions = {
			...httpOptions,
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
			console.log(`starting server at ${config.domain}`)
			httpServer.listen(80)
			httpsServer.listen(443)
		})
	}

	server.on('error', (error) => console.error(error))
})
