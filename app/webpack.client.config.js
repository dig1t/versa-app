const webpack = require('webpack')
const path = require('path')
const ReactRefreshPlugin = require('@pmmmwh/react-refresh-webpack-plugin')

const dev = process.env.NODE_ENV === 'development'

module.exports = {
	mode: dev ? 'development' : 'production',
	
	//devtool: 'source-map',
	
	entry: {
		main: [
			'webpack-hot-middleware/client?path=/__webpack_hmr&timeout=20000&reload=true',
			path.resolve(__dirname, 'src', 'client.js')
		]
	},
	
	output: {
		path: path.join(__dirname, 'dist/public/assets/js'),
		filename: 'bundle.js',
		publicPath: '/assets'
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
							require.resolve('react-refresh/babel')
						].filter(Boolean)
					}
				}]
			}
		]
	},
	
	plugins: [
		new webpack.HotModuleReplacementPlugin(),
		new ReactRefreshPlugin({
			overlay: {
				sockIntegration: 'whm'
			}
		})
	].filter(Boolean)
}