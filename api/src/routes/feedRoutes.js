import { Router } from 'express'

import feedController from '../controllers/feedController.js'

export default (server) => {
	const router = new Router()
	
	router.get(
		'/feed/home',
		server.oauth.authorize(),
		feedController.getHomeFeed
	)
	
	return router
}