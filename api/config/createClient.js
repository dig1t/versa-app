import fs from 'fs'
import path from 'path'
import jose from 'node-jose'
import { fileURLToPath } from 'url'

import oauth from '../src/services/auth/oauth.js'
import db from '../src/services/db.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const makeKeys = async () => {
	const keyStore = new jose.JWK.createKeyStore()

	await Promise.all([
		keyStore.generate('RSA', 2048, { use: 'sig' }),
		keyStore.generate('EC', 'P-256', { use: 'sig', alg: 'ES256' }),
		//keystore.generate('OKP', 'Ed25519', { use: 'sig', alg: 'EdDSA' }),
	]).then(() => {
		fs.writeFileSync(path.resolve('./jwks.json'), JSON.stringify(keyStore.toJSON(true), null, 2))
	})
}

const JWKS_PATH = path.resolve(__dirname, './jwks.json')

// Check if jwks.json exists
if (!fs.existsSync(JWKS_PATH)) {
	console.log('jwks.json not found, creating...')
	
	await makeKeys()
	
	console.log(`wrote jwks.json to ${JWKS_PATH}`)
}

db.connect()
db.instance.once('open', async () => {
	console.log('database connection success')
	
	const { client_id, client_secret } = await oauth.issueClientCredentials()
	
	console.log('client credentials issued, copy the following into .env')
	console.log(`OAUTH_CLIENT_ID="${client_id}"\nOAUTH_CLIENT_SECRET="${client_secret}"`)
})