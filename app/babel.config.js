module.exports = function babel(api) {
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