const path = require('path')
const webpackNodeExternals = require('webpack-node-externals')
const { merge } = require('webpack-merge')

const clientConfig = require('./webpack.client.config.js')

module.exports = merge(clientConfig, {
	target: 'node',
	
	externalsPresets: { node: true },
	
	externals: [ webpackNodeExternals() ],
	
	entry: path.resolve(__dirname, 'server', 'index.js'),
	
	output: {
		path: path.join(__dirname, 'dist'),
		filename: 'server.bundle.js'
	}
})