import config from '../../../config'
import * as jwks from '../jwks.json'

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
			client_id: 'foo',
			redirect_uris: [config.domain],
			response_types: ['id_token'],
			grant_types: ['authorization_code', 'implicit', 'refresh_token'],
			token_endpoint_auth_method: 'none',
		}
	],
	
	scopes: ['openid', 'offline_access', 'api:read'],
	
	cookies: {
		keys: ['rdfvgrdeswgerwsdfgt']
	},
	
	features: {
		devInteractions: {
			enabled: false
		}
	},
	
	jwks
}