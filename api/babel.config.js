// eslint-disable-next-line @typescript-eslint/no-var-requires
require('dotenv').config({ path: '../.env' })

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
			'@babel/plugin-proposal-class-properties',
			['inline-dotenv', {
				path: '../.env'
			}]
		]
	}
}