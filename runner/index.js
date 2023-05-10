import path from 'path'
import webpack from 'webpack'
import chokidar from 'chokidar'
import ColorfulConsole from './util/ColorfulConsole.js'
import { spawn } from 'node:child_process'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const WATCH_TIMEOUT = 800

class Runner {
	constructor(options) {
		if (typeof options !== 'object') {
			throw new Error('Compiler requires an options object')
		} else if (typeof options.name !== 'string') {
			throw new Error('Compiler instance requires a name')
		} else if (typeof options.watchDir !== 'string') {
			throw new Error('Compiler requires a directory to watch')
		}
		
		this.options = options
		this.name = this.options.name || 'compiler'
		this.entryPath = options.entryPath
		this.webpackConfig = options.webpackConfig
		
		if (this.webpackConfig) {
			this.compiler = webpack(this.webpackConfig)
		}
		
		return this
	}
	
	compile() {
		if (this.compiler === undefined) {
			throw new Error('Compiler requires a webpack config to run')
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
	
	watch() {
		this.watcher = chokidar.watch(this.options.watchDir)
		
		this.watcher.on(
			'all',
			(event, path) => this.handleWatchChange(event, path)
		)
	}
	
	handleWatchChange(event, path) {
		if (this.watchTimeout === true) return
		
		this.watchTimeout = true
		
		setTimeout(() => {
			this.watchTimeout = false
		}, WATCH_TIMEOUT)
		
		console.log(ColorfulConsole.magenta(`[${this.name}]`), 'detected file change', ColorfulConsole.bold(path))
		
		this.run()
	}
	
	async run() {
		if (typeof this.process !== 'undefined') {
			await this.stopServer()
		}
		
		this.startServer()
	}
	
	startServer() {
		console.log(ColorfulConsole.yellow(`[${this.name}]`), `starting server`)
		
		this.process = spawn(
			'node',
			['--no-warnings', this.entryPath],
			{
				env: process.env
			}
		)
		
		this.process.stdout.on('data', (data) => {
			console.log(ColorfulConsole.yellow(`[${this.name}]`), data.toString())
		})
		
		this.process.stderr.on('data', (data) => {
			console.log(ColorfulConsole.red(`[${this.name}]`), data.toString())
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

const appRunner = new Runner({
	name: 'versa-app',
	entryPath: './app/server/index.js',
	watchDir: path.resolve(__dirname, '../app/server')
})

const apiRunner = new Runner({
	name: 'versa-api',
	entryPath: './api/src/index.js',
	watchDir: path.resolve(__dirname, '../api/src')
})

appRunner.watch()
apiRunner.watch()