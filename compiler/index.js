/* eslint-disable no-undef */
/* eslint-disable @typescript-eslint/no-var-requires */
const path = require('path')
const webpack = require('webpack')
const chokidar = require('chokidar')
const ColorfulConsole = require('./util/ColorfulConsole.cjs')
const { spawn } = require('node:child_process')
const pm2 = require('pm2')

//const webpackClientConfig = require('../webpack.client.config.cjs')
const webpackServerConfig = require('../app/webpack.server.config.cjs')
const webpackAPIServerConfig = require('../config/webpack.api.server.config.js')

const WATCH_TIMEOUT = 1000

class Compiler {
	constructor(options) {
		if (typeof options !== 'object') {
			throw new Error('Compiler requires an options object')
		} else if (typeof options.name !== 'string') {
			throw new Error('Compiler instance requires a name')
		} else if (typeof options.webpackConfig !== 'object') {
			throw new Error('Compiler requires a webpack config to run')
		} else if (typeof options.watchDir !== 'string') {
			throw new Error('Compiler requires a directory to watch')
		}
		
		this.options = options
		this.webpackConfig = options.webpackConfig
		
		this.name = this.options.name || 'compiler'
		
		this.compiler = webpack(options.webpackConfig)
		
		return this
	}
	
	watch() {
		this.watcher = chokidar.watch(this.options.watchDir)
		
		this.watcher.on(
			'all',
			(event, path) => this.handleWatchChange(event, path)
		)
	}
	
	handleWatchChange(event, path) {
		console.log('handle watch change')
		if (this.watchTimeout) return
		
		this.watchTimeout = setTimeout(() => {
			clearTimeout(this.watchTimeout)
			this.watchTimeout = undefined
		}, WATCH_TIMEOUT)
		
		console.log(ColorfulConsole.magenta(`[${this.name}]`), 'detected file change', ColorfulConsole.bold(path))
		
		this.run()
	}
	
	async run() {
		if (typeof this.process !== 'undefined') {
			await this.stopServer()
		}
		
		const compileStart = Date.now()
		
		console.log(ColorfulConsole.magenta(`[${this.name}]`), `compiling`)
		
		this.compiler.run((err, stats) => {
			const compileTime = Date.now() - compileStart
			
			if (err || stats.hasErrors()) {
				console.log(ColorfulConsole.red(`[${this.name}]`), ColorfulConsole.bold('error occured during build!'))
				console.log(ColorfulConsole.red(`[${this.name}]`), err || stats)
			} else {
				console.log(ColorfulConsole.magenta(`[${this.name}]`), 'compiled in', ColorfulConsole.bold(`${compileTime}ms`))
				
				if (this.options.useServer) this.startServer()
			}
		})
	}
	
	startServer() {
		console.log(ColorfulConsole.yellow(`[${this.name}]`), `starting server`)
		
		const filePath = path.resolve(
			this.webpackConfig.output.path,
			this.webpackConfig.output.filename
		)
		
		pm2.start(
			{
				name: this.name,
				script: filePath,
				//exec_mode: 'cluster',
				//instances: 'max'
			},
			(error, apps) => {
				if (error) {
					console.error(err)
				} else {
					console.log(
						ColorfulConsole.yellow(`[${this.name}]`),
						'server started'
					)
				}
			}
		)
		
		pm2.logs(this.name, (err, logs) => {
			if (err) {
				console.log(
					ColorfulConsole.red(`[${this.name}]`), err
				)
				process.exit(1)
			}
			
			// Log the logs to the console
			console.log(
				ColorfulConsole.yellow(`[${this.name}]`), logs
			)
		})
	}
	
	async stopServer() {
		if (typeof this.process === 'undefined') return
		
		console.log(ColorfulConsole.yellow(`[${this.name}]`), 'restarting server...')
		
		return new Promise((resolve, reject) => {
			if (this.process.killed) return resolve()
			
			this.process.on('close', (code) => {
				if (code && code > 0) reject(`unexpected error occured during server restart. Exit code: ${code}`)
				
				this.process = undefined
				
				resolve()
			})
			
			this.process.kill()
		})
	}
}

pm2.connect(true, (error) => {
	const serverCompiler = new Compiler({
		name: 'versa-server',
		webpackConfig: webpackServerConfig,
		watchDir: path.resolve(__dirname, '../app/server'),
		useServer: true
	})
	
	const apiCompiler = new Compiler({
		name: 'versa-api',
		webpackConfig: webpackAPIServerConfig,
		watchDir: path.resolve(__dirname, '../api/server/src'),
		useServer: true
	})
	
	//apiCompiler.watch()
	//apiCompiler.run()
	serverCompiler.watch()
})