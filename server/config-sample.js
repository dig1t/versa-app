const dev = process.env.NODE_ENV !== 'production'

export default {
	port: 80,
	name: 'App',
	meta: {
		title: 'App',
		description: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit.',
		language: 'en'
	},
	keys: {
		googleMaps: 'xxxxx'
	},
	expressSecret: 'xxxxx',
	db: dev ? 'mongodb://localhost:27017/database' : 'mongodb://user:pass@url:port/db',
	theme_color: '#000011',
	dev
}