export default async app => {
	/* User Account API */
	
	/* Content API */
	
	/* FAQ Structure
	* Category
	* > Question & Answer */
	
	// dummy data, replace with a real mongodb req
	const galleryMockData = [
		{
			name: 'asd',
			description: 'sfc',
			image: 'https://via.placeholder.com/400',
			id: Math.random().toString(36).substring(7)
		},
		{
			name: 'asasfd',
			description: 'sfafc',
			image: 'https://via.placeholder.com/420',
			id: Math.random().toString(36).substring(7)
		},
		{
			name: 'asd',
			description: 'sfc',
			image: 'https://via.placeholder.com/400',
			id: Math.random().toString(36).substring(7)
		},
		{
			name: 'asasfd',
			description: 'sfafc',
			image: 'https://via.placeholder.com/420',
			id: Math.random().toString(36).substring(7)
		},
		{
			name: 'asd',
			description: 'sfc',
			image: 'https://via.placeholder.com/400',
			id: Math.random().toString(36).substring(7)
		},
		{
			name: 'asasfd',
			description: 'sfafc',
			image: 'https://via.placeholder.com/420',
			id: Math.random().toString(36).substring(7)
		},
		{
			name: 'asd',
			description: 'sfc',
			image: 'https://via.placeholder.com/400',
			id: Math.random().toString(36).substring(7)
		}
	]
	
	app.get('/api/content/gallery', (req, res, next) => {
		return res.send(galleryMockData)
	})
}