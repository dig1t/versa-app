const path = require('path')
const nodeExternals = require('webpack-node-externals')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const { merge } = require('webpack-merge')

const clientConfig = require('./webpack.client.config.js')

module.exports = merge(clientConfig, {
	target: 'node',
	
	externalsPresets: { node: true },
	
	externals: [ nodeExternals() ],
	
	entry: path.resolve(__dirname, 'server', 'index.js'),
	
	output: {
		path: path.join(__dirname, 'dist'),
		filename: 'server.bundle.js'
	},
	
	module: {
		rules: [
			{
				test: /\.(ejs)$/,
				exclude: /node_modules/,
				use: ['ejs-loader']
			}
		]
	},
	
	plugins: [
		new HtmlWebpackPlugin({
			template: '!!raw-loader!./server/views/template.ejs',
			filename: 'views/template.ejs'
		})
	]
})