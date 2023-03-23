/* eslint-disable @typescript-eslint/no-var-requires */
const path = require('path')
const webpackNodeExternals = require('webpack-node-externals')

const dev = process.env.NODE_ENV === 'development'

module.exports = {
	mode: dev ? 'development' : 'production',
	
	target: 'node',
	
	externalsPresets: { node: true },
	
	externals: [ webpackNodeExternals() ],
	
	cache: !dev,
	
	devtool: 'inline-source-map',
	
	watchOptions: {
		ignored: [
			path.resolve(__dirname, 'node_modules'),
			path.resolve(__dirname, 'dist')
		]
	},
	
	entry: path.resolve(__dirname, 'index.js'),
	
	output: {
		path: path.join(__dirname, 'dist'),
		filename: 'server.bundle.js'
	},
	
	module: {
		rules: [
			{
				test: /\.js$/,
				exclude: /(node_modules)/,
				use: {
					// `.swcrc` can be used to configure swc
					loader: 'swc-loader'
				}
			}
		]
	}
}