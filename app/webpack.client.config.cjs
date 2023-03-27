const webpack = require('webpack')
const path = require('path')
const webpackNodeExternals = require('webpack-node-externals')
const ReactRefreshPlugin = require('@pmmmwh/react-refresh-webpack-plugin')

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
	
	cache: !dev,
	
	devtool: false, //dev && 'inline-source-map',
	
	watchOptions: {
		ignored: [
			path.resolve(__dirname, 'node_modules'),
			path.resolve(__dirname, 'dist')
		]
	},
	
	//cleanOnceBeforeBuildPatterns: ['dist/*', '!dist/public'],
	
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
					loader: require.resolve('swc-loader'),
					options: swcOptions
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
		/*new webpack.DefinePlugin({
			'process.env': JSON.stringify(dotenv.parsed)
		}),*/
		dev && new webpack.HotModuleReplacementPlugin(),
		dev && new ReactRefreshPlugin({
			overlay: {
				sockIntegration: 'whm'
			}
		})
	].filter(Boolean)
}