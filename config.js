// THIS CONFIG FILE SHOULD NOT BE
// INCLUDED IN ANY CLIENT CODE

const dev = process.env.NODE_ENV

const domain = 'https://versaapp.co'
const apiDomain = 'https://api.versaapp.co'

const devDomain = 'http://localhost'
const devApiDomain = 'http://localhost:81'

module.exports = {
	port: 80,
	apiPort: 81,
	
	appName: 'Versa',
	appDescription: 'Universal Social Identity',
	brandColor: '#4e85fb',
	
	// short names for token cookies
	shortName: {
		session: 'vsi',
		refreshToken: 'vrt'
	},
	
	expressSecret: process.env.EXPRESS_SECRET,
	
	db: dev ? process.env.DEV_DB_URI : process.env.DB_URI,
	appDB: dev ? process.env.DEV_APP_DB_URI : process.env.APP_DB_URI,
	
	client_id: process.env.CLIENT_ID,
	client_secret: process.env.CLIENT_SECRET,
	client_secret_original: process.env.CLIENT_SECRET_ORIGINAL,
	
	_domain: domain,
	_apiDomain: apiDomain,
	
	domain: dev ? devDomain : domain,
	apiDomain: dev ? devApiDomain : apiDomain,
	
	dev
}