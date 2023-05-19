import webpack from 'webpack'
import WebpackHotMiddleware from 'webpack-hot-middleware'
import WebpackDevMiddleware from 'webpack-dev-middleware'

import webpackClientConfig from '../../webpack.client.config.cjs'

export default (server) => {
	// This middleware will only be enabled in development
	if (server.get('env') !== 'development') return
	
	const compiler = webpack(webpackClientConfig)
	
	let initialCompile = true
	
	compiler.hooks.done.tap('VersaCompiler', () => {
		if (initialCompile !== true) console.log('refreshing client...')
		
		initialCompile = false
		
		return true
	})
	
	// Webpack watcher
	server.use(WebpackDevMiddleware(compiler, {
		publicPath: webpackClientConfig.output.publicPath,
		writeToDisk: true,
		stats: 'none'
	}))
	
	// Socket server
	server.use(WebpackHotMiddleware(compiler, {
		log: false,
		path: '/__hot-reload',
		heartbeat: 1 * 1000
	}))
}