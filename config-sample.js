const dev = process.env.NODE_ENV !== 'production'

module.exports = {
	port: 80,
	devPort: 3030,
	name: 'React Starter Kit',
	meta: {
		title: 'React Starter Kit',
		description: 'My react app!',
		language: 'en'
	},
	keys: {
		googleMaps: 'xxxxx'
	},
	expressSecret: process.env.EXPRESS_SECRET || 'xxxxx',
	db: dev ? 'mongodb+srv://main:password@user/mainDB' : process.env.DB_URI,
	appDB: 'mongodb+srv://frontend:127.0.0.1/mainDB?retryWrites=true&w=majority',
	theme_color: '#9e15cc',
	dev
}