import config from '../../config.js'
import jwks from '../../config/jwks.json' assert { type: 'json' };

export default {
	clients: [
		{
			redirect_uris: [config._domain],
			grant_types: ['authorization_code'],
			scope: 'openid'
		}
	],
	
	grants: ['ropc'],
	
	scopes: ['openid', 'offline_access', 'api:read'],
	
	cookies: {
		keys: ['rdfvgrdeswgerwsdfgt']
	},
	
	features: {
		devInteractions: {
			enabled: false
		},
		
		revocation: {
			enabled: true
		}
	},
	
	ttl: {
		AccessToken: 24 * 60 * 60 * 7, // 1 week
		AuthorizationCode: 24 * 60 * 60, // 1 day
		ClientCredentials: 24 * 60 * 60, // 1 day
		DeviceCode: 24 * 60 * 60, // 1 day
		IdToken: 24 * 60 * 60, // 1 day
		RefreshToken: 24 * 60 * 60 * 365, // 1 year
		Grant: 24 * 60 * 60 * 365 // 1 year
	},
	
	jwks
}