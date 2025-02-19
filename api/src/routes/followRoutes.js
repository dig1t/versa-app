import { Router } from 'express'

import useFields from '../middleware/useFields.js'

import followController from '../controllers/followController.js'

export default (server) => {
	const router = new Router()

	router.get(
		'/follow/connection',
		useFields({
			fields: ['userId']
		}),
		server.oauth.authorize(),
		followController.getFollowConnection
	)

	router.get(
		'/follow/list',
		useFields({
			fields: ['userId'],
			optionalFields: ['page']
		}),
		server.oauth.authorize({ optional: true }),
		followController.getFollowList
	)

	router.get(
		'/follow/following_list',
		useFields({
			fields: ['userId'],
			optionalFields: ['page']
		}),
		server.oauth.authorize({ optional: true }),
		followController.getFollowingList
	)

	router.post(
		'/follow/new',
		useFields({ fields: ['userId'] }),
		server.oauth.authorize(),
		followController.postFollowNew
	)

	router.post( // TODO: make this a delete request
		'/follow/unfollow',
		useFields({ fields: ['userId'] }),
		server.oauth.authorize(),
		followController.postUnfollow
	)

	return router
}
