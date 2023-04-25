/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable no-undef */
const path = require('path')
const webpackNodeExternals = require('webpack-node-externals')

const dotenv = require('dotenv').config({
	path: path.resolve(__dirname, '../.env')
})

const dev = dotenv.parsed.NODE_ENV === 'development'

module.exports = {
	target: 'node',
	
	cache: dev,
	
	entry: path.resolve(__dirname, '../api/src', 'index.js'),
	
	externalsPresets: { node: true },
	
	externals: [ webpackNodeExternals() ],
	
	output: {
		path: path.join(__dirname, '../dist/api'),
		filename: 'server.bundle.js'
	},
	
	module: {
		rules: [
			{
				test: /\.js$/,
				exclude: /(node_modules)/,
				use: ['swc-loader']
			}
		]
	}
}