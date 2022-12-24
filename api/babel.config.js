module.exports = function babel(api) {
	api.cache.using(() => process.env.NODE_ENV)
	
	return {
		presets: [
			['@babel/preset-env', {
				'targets': {
					node: 'current'
				}
			}]
		],
		
		plugins: [
			'@babel/plugin-proposal-class-properties'
		]
	}
}