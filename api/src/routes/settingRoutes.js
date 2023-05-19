import { Router } from 'express'

import useFields from '../middleware/useFields.js'

import settingController from '../controllers/settingController.js'

export default (server) => {
	const router = new Router()
	
	router.get(
		'/user/:userId/settings',
		useFields({ params: ['userId'] }),
		server.oauth.authorize(),
		settingController.getSettings
	)
	
	router.post(
		'/user/:userId/settings',
		useFields({ params: ['userId'] }),
		server.oauth.authorize(),
		settingController.updateSettings
	)
	
	return router
}