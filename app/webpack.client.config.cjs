const webpack = require('webpack')
const path = require('path')
const webpackNodeExternals = require('webpack-node-externals')
const ReactRefreshPlugin = require('@pmmmwh/react-refresh-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')

const dotenv = require('dotenv').config({ path: '.env' })
const dev = process.env.NODE_ENV === 'development'

const swcOptions = {
	sync: true,
	jsc: {
		transform: {
			react: {
				development: true,
				refresh: true,
				//runtime: 'automatic'
			}
		}
	},
	minify: !dev
}

module.exports = {
	mode: dev ? 'development' : 'production',
	
	target: 'web',
	
	cache: dev,
	
	devtool: dev && 'inline-source-map',
	
	watchOptions: {
		ignored: [
			path.resolve(__dirname, 'node_modules'),
			path.resolve(__dirname, 'dist')
		]
	},
	
	entry: {
		main: [
			dev && 'webpack-hot-middleware/client?path=/__hot-reload&timeout=20000&reload=true',
			path.resolve(__dirname, 'src', 'client.js')
		].filter(Boolean)
	},
	
	output: {
		path: path.join(__dirname, 'dist/public/assets/js'),
		filename: 'bundle.js',
		publicPath: '/assets/js/',
		clean: true
	},
	
	module: {
		rules: [
			{
				test: /\.js$/,
				exclude: /(node_modules)/,
				use: [{
					loader: 'swc-loader',
					options: swcOptions
				}]
			},
			{
				test: /\.css$/i,
				use: [
					MiniCssExtractPlugin.loader,
					'style-loader',
					'css-loader',
					'sass-loader'
				]
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
				use: [
					{
						loader: 'swc-loader',
						options: swcOptions
					},
					{
						loader: '@svgr/webpack',
						options: { babel: false }
					}
				]
			}
		]
	},
	
	plugins: [
		/*new webpack.DefinePlugin({
			'process.env': JSON.stringify(dotenv.parsed)
		}),*/
		new MiniCssExtractPlugin(),
		dev && new webpack.HotModuleReplacementPlugin(),
		dev && new ReactRefreshPlugin({
			overlay: {
				sockIntegration: 'whm'
			}
		})
	].filter(Boolean)
}