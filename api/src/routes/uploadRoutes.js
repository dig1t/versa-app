import { Router } from 'express'

import useFields from '../middleware/useFields.js'

import uploadController from '../controllers/uploadController.js'

export default (server) => {
	const router = new Router()

	router.post(
		'/media/upload',
		server.oauth.authorize(),
		uploadController.uploadMedia
	)

	router.get(
		'/media/:mediaId',
		useFields({ params: ['mediaId'] }),
		server.oauth.authorize(),
		uploadController.getMedia
	)

	router.delete(
		'/media/:mediaId',
		useFields({ params: ['mediaId'] }),
		server.oauth.authorize(),
		uploadController.deleteMedia
	)

	return router
}
