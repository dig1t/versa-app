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
	path: path.resolve(__dirname, '../../.env')
}).parsed
const dev = env.NODE_ENV

export default {
	port: 8080,
	apiPort: 8888,
	
	appName: 'Versa',
	appDescription: 'Universal Social Identity',
	brandColor: '#4e85fb',
	
	// short names for token cookies
	shortName: {
		session: 'vsi',
		refreshToken: 'vrt'
	},
	
	expressSecret: env.EXPRESS_SESSION_SECRET,
	sessionSecret: env.SESSION_STORE_SECRET,
	
	appDatabaseName: env.APP_DB_NAME,
	
	sessionDatabaseURI: env.SESSION_DB_URI,
	
	_domain: domain,
	_apiDomain: apiDomain,
	
	domain: dev ? devDomain : domain,
	apiDomain: dev ? devApiDomain : apiDomain,
	
	dev
}