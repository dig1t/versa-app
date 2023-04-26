/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable no-undef */
const webpack = require('webpack')
const path = require('path')
const ReactRefreshPlugin = require('@pmmmwh/react-refresh-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const dotenv = require('dotenv')

const env = dotenv.config({
	path: path.resolve(__dirname, '../.env')
}).parsed

const dev = env.NODE_ENV === 'development'

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
		path: path.join(__dirname, './public/assets/client'),
		filename: 'bundle.js',
		publicPath: '/assets/client',
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
				test: /\.scss$/,
				use: [
					MiniCssExtractPlugin.loader,
					{
						loader: 'css-loader',
						options: {
							url: false,
							//modules: true,
							sourceMap: false,
							importLoaders: 1
						}
					},
					'sass-loader'
				]
			},
			{
				test: /\.svg$/,
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
		new MiniCssExtractPlugin({
			filename: 'styles.css',
			chunkFilename: '[id].[contenthash].css'
		}),
		dev && new webpack.HotModuleReplacementPlugin(),
		dev && new ReactRefreshPlugin({
			overlay: {
				sockIntegration: 'whm'
			}
		})
	].filter(Boolean)
}