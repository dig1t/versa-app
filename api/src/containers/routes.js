import { Router } from 'express'

import users from './users.js'
import profiles from './profiles.js'
import posts from './posts.js'

export default server => {
	const router = new Router()
	
	router.get('/ping', (_req, res) => res.json({ pong: true }))
	
	router.use(users(server))
	router.use(profiles(server))
	router.use(posts(server))
	
	return router
}