import config from '../../config.js'
import jwks from '../jwks.json' assert { type: 'json' };

/*
import fs from 'fs'
import path from 'path'
import jose from 'node-jose'

const keyStore = new jose.JWK.createKeyStore()

Promise.all([
	keyStore.generate('RSA', 2048, { use: 'sig' }),
	keyStore.generate('EC', 'P-256', { use: 'sig', alg: 'ES256' }),
	//keystore.generate('OKP', 'Ed25519', { use: 'sig', alg: 'EdDSA' }),
]).then(() => {
	fs.writeFileSync(path.resolve('src/jwks.json'), JSON.stringify(keyStore.toJSON(true), null, 2))
})
*/

export default {
	clients: [
		{
			client_id: config.client_id,
			client_secret: config.client_secret,
			
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