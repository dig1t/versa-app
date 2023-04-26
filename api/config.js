import dotenv from 'dotenv'
import path from 'path'
import { fileURLToPath } from 'url'

const domain = 'https://versaapp.co'
const apiDomain = 'https://api.versaapp.co'

const devDomain = 'http://localhost:8080'
const devApiDomain = 'http://localhost:8888'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const env = dotenv.config({
	// eslint-disable-next-line no-undef
	path: path.resolve(__dirname, '../.env')
}).parsed
const dev = env.NODE_ENV

export default {
	port: 8080,
	apiPort: 8888,
	
	appName: 'Versa',
	appDescription: 'Universal Social Identity',
	brandColor: '#4e85fb',
	
	cdn: {
		getEndpoint: (accountId) => `https://${accountId}.r2.cloudflarestorage.com`,
		accountId: env.CDN_ACCOUNT_ID,
		bucketName: env.CDN_BUCKET_NAME,
		accessKeyId: env.CDN_ACCESS_KEY_ID,
		accessKeySecret: env.CDN_ACCESS_KEY_SECRET
	},
	
	// short names for token cookies
	shortName: {
		session: 'vsi',
		refreshToken: 'vrt'
	},
	
	expressSecret: env.EXPRESS_SECRET,
	
	db: env.DB_URI,
	appDB:env.APP_DB_URI,
	
	client_id: env.CLIENT_ID,
	client_secret: env.CLIENT_SECRET,
	client_secret_original: env.CLIENT_SECRET_ORIGINAL,
	
	_domain: domain,
	_apiDomain: apiDomain,
	
	domain: dev ? devDomain : domain,
	apiDomain: dev ? devApiDomain : apiDomain,
	
	dev
}