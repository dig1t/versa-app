import { Router } from 'express'

import useFields from '../middleware/useFields.js'

import profileController from '../controllers/profileController.js'

export default (server) => {
	const router = new Router()

	router.get(
		[
			'/profile/:userId?',
			'/profile/username/:username'
		],
		server.oauth.authorize({ optional: true }),
		profileController.getProfile
	)

	router.get(
		'/profile/:userId/feed',
		useFields({ params: ['userId'] }),
		server.oauth.authorize({ optional: true }),
		profileController.getProfileFeed
	)

	return router
}
