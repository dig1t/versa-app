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
	theme_color: '#4e85fb',
	
	expressSecret: process.env.EXPRESS_SECRET,
	db: dev ? process.env.DEV_DB_URI : process.env.DB_URI,
	appDB: dev ? process.env.DEV_APP_DB_URI : process.env.APP_DB_URI,
	
	domain: dev ? domain : devDomain,
	apiDomain: dev ? apiDomain : devApiDomain,
	
	dev
}