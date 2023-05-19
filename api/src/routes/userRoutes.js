import { Router } from 'express'

import useFields from '../middleware/useFields.js'

import userController from '../controllers/userController.js'

export default (server) => {
	const router = new Router()
	
	router.get(
		'/user/:userId',
		useFields({ fields: ['sessionId'] }),
		server.oauth.authorize({ optional: true }),
		userController.getUser
	)
	
	router.post(
		'/user/authenticate',
		useFields({ fields: ['email', 'password'] }),
		server.oauth.useROPCGrant(),
		userController.postAuthenticate
	)
	
	router.post(
		'/user/new',
		useFields({ fields: ['name', 'email', 'password'] }),
		userController.postUserNew
	)
	
	return router
}