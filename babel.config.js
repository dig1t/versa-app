module.exports = function babel(api) {
	const BABEL_ENV = api.env()
	const presets = []
	const plugins = []
	
	api.cache.using(() => process.env.NODE_ENV)
	
	return {
		presets: [
			['@babel/preset-env', {
				'targets': {
					node: 'current'
				}
			}],
			['@babel/preset-react', {
				development: !api.env('production'), runtime: 'automatic'
			}]
		],
		
		plugins: [
			'@babel/plugin-proposal-class-properties',
			'@babel/plugin-transform-react-jsx',
		]
	}
}