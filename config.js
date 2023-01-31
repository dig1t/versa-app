const dev = process.env.NODE_ENV

module.exports = {
	port: 80,
	apiPort: 81,
	devPort: 3030,
	name: 'Versa',
	meta: {
		title: 'Versa',
		description: 'Universal Social Identity',
		language: 'en'
	},
	expressSecret: process.env.EXPRESS_SECRET,
	db: dev ? process.env.DEV_DB_URI : process.env.DB_URI,
	appDB: dev ? process.env.DEV_APP_DB_URI : process.env.APP_DB_URI,
	theme_color: '#4e85fb',
	dev
}