import { Router } from 'express'

import useFields from '../middleware/useFields.js'
import contentController from '../controllers/contentController.js'

export default (server) => {
	const router = new Router()

	router.get(
		'/content/:contentId',
		useFields({ params: ['contentId'] }),
		server.oauth.authorize({ optional: true }),
		contentController.getContentData
	)

	router.post(
		'/content/:contentId/comment',
		useFields({ fields: ['body'], params: ['contentId'] }),
		server.oauth.authorize(),
		contentController.postCommentData
	)

	router.delete(
		'/content/:contentId/comment',
		useFields({ params: ['contentId'] }),
		server.oauth.authorize(),
		contentController.deleteCommentData
	)

	router.post(
		'/content/:contentId/like',
		useFields({ params: ['contentId'] }),
		server.oauth.authorize(),
		contentController.postLike
	)

	router.delete(
		'/content/:contentId/like',
		useFields({ params: ['contentId'] }),
		server.oauth.authorize(),
		contentController.deleteLike
	)

	router.get(
		'/content/:contentId/comments',
		useFields({ params: ['contentId'] }),
		server.oauth.authorize({ optional: true }),
		contentController.getCommentsData
	)

	router.post(
		'/post/new',
		useFields({ allowObjects: true }),
		server.oauth.authorize(),
		contentController.postNewPost
	)

	router.delete(
		'/post/:postId',
		useFields({ params: ['postId'] }),
		server.oauth.authorize(),
		contentController.deletePost
	)

	router.get(
		'/post/:postId',
		useFields({ params: ['postId'] }),
		server.oauth.authorize({ optional: true }),
		contentController.getPostData
	)

	return router
}
