const webpack = require('webpack')
const path = require('path')
const ReactRefreshPlugin = require('@pmmmwh/react-refresh-webpack-plugin')

const dotenv = require('dotenv').config({ path: '../.env' })
const dev = process.env.NODE_ENV === 'development'

module.exports = {
	mode: dev ? 'development' : 'production',
	
	cache: !dev,
	
	devtool: 'inline-source-map',
	
	watchOptions: {
		ignored: [
			path.resolve(__dirname, 'node_modules'),
			path.resolve(__dirname, 'dist')
		]
	},
	
	entry: {
		main: [
			'webpack-hot-middleware/client?path=/__webpack_hmr&timeout=20000&reload=true',
			path.resolve(__dirname, 'src', 'client.js')
		].filter(Boolean)
	},
	
	output: {
		path: path.join(__dirname, 'dist/public/assets/js'),
		filename: 'bundle.js',
		publicPath: '/assets',
		clean: true
	},
	
	module: {
		rules: [
			{
				test: /\.js$/,
				exclude: /node_modules/,
				use: [{
					loader: 'babel-loader',
					options: {
						plugins: [
							dev && require.resolve('react-refresh/babel')
						].filter(Boolean)
					}
				}]
			},
			{
				test: /\.svg$/i,
				type: 'asset',
				resourceQuery: /url/ // *.svg?url
			},
			{
				test: /\.svg$/,
				//issuer: /\.js$/,
				resourceQuery: { not: [/url/] },
				use: ['@svgr/webpack']
			}
		]
	},
	
	plugins: [
		new webpack.DefinePlugin({
			'process.env': JSON.stringify(dotenv.parsed)
		}),
		dev && new webpack.HotModuleReplacementPlugin(),
		dev && new ReactRefreshPlugin({
			overlay: {
				sockIntegration: 'whm'
			}
		})
	].filter(Boolean)
}