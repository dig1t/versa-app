const path = require('path')
const { merge } = require('webpack-merge')
const webpackNodeExternals = require('webpack-node-externals')

const clientConfig = require('./webpack.client.config.cjs')

module.exports = merge(clientConfig, {
	target: 'node',
	
	entry: path.resolve(__dirname, 'server', 'index.js'),
	
	externalsPresets: { node: true },
	
	externals: [ webpackNodeExternals() ],
	
	output: {
		path: path.join(__dirname, 'dist/server'),
		filename: 'server.bundle.js'
	}
})