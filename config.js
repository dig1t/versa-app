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
	
	client_id: 'c107df41fa8ee22bbefbf9832f275ebe',
	client_secret: '$2b$08$o0fRLo3F2Oh9oh50eSAjcuayI0XUgREgC0GAsHo0iF3ZvFw9CKwim',
	client_secret_original: '31c87214515767f04ba13bab40ab9fc87951e210ad7cc0fe36a028dfa37e3ccf',
	
	domain: dev ? domain : devDomain,
	apiDomain: dev ? apiDomain : devApiDomain,
	
	dev
}