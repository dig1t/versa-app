// THIS CONFIG FILE SHOULD NOT BE
// INCLUDED IN ANY CLIENT CODE

import dotenv from 'dotenv'

const domain = 'https://versaapp.co'
const apiDomain = 'https://api.versaapp.co'

const devDomain = 'http://localhost'
const devApiDomain = 'http://localhost'

const env = dotenv.config({ path: '.env' }).parsed
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
	
	expressSecret: env.EXPRESS_SECRET,
	
	db: dev ? env.DEV_DB_URI : env.DB_URI,
	appDB: dev ? env.DEV_APP_DB_URI : env.APP_DB_URI,
	
	client_id: env.CLIENT_ID,
	client_secret: env.CLIENT_SECRET,
	client_secret_original: env.CLIENT_SECRET_ORIGINAL,
	
	_domain: domain,
	_apiDomain: apiDomain,
	
	domain: dev ? devDomain : domain,
	apiDomain: dev ? devApiDomain : apiDomain,
	
	dev
}