
import { Router } from 'express'

import { asyncMiddleware } from '../util'

import { authenticate, createAccount, getUserIdFromSession, getUserFromUserId } from './users'
import { createPost } from './posts'

const router = Router()

router.get('/ping', (_req, res) => {
	res.json({ pong: true })
})

router.get('/user', asyncMiddleware(async (req, res) => {
	if (!res.getFields([ 'userId' ], true)) return
	
	getUserFromUserId(req.fields.userId)
		.then(result => res.apiResult(200, result))
		.catch(err => res.apiResult(500, {
			message: err
		}))
}))

router.post('/user/authenticate', asyncMiddleware(async (req, res) => {
	if (!res.getFields([ 'email', 'password' ], true)) return
	
	authenticate(req)
		.then(result => res.apiResult(200, result))
		.catch(err => {
			res.apiResult(401, {
				message: err
			})
		})
}))

router.post('/user/authenticate_session', asyncMiddleware(async (req, res) => {
	if (!res.getFields([ 'sessionId' ], true)) return
	
	authenticateSession(req.fields.sessionId)
		.then(result => res.apiResult(200, result))
		.catch(err => {
			res.apiResult(401, {
				message: err
			})
		})
}))

router.post('/user/new', asyncMiddleware(async (req, res) => {
	if (!res.getFields([ 'name', 'email', 'password' ], true)) return
	
	createAccount(req)
		.then(result => res.apiResult(200, result))
		.catch(err => res.apiResult(500, {
			message: err
		}))
}))

router.post('/post/new', asyncMiddleware(async (req, res) => {
	if (!res.getFields([ 'sessionId', 'text' ], true)) return
	
	try {
		const userId = await getUserIdFromSession(req.fields.sessionId)
		
		if (userId) createPost(userId, req.fields)
			.then(result => res.apiResult(200, result))
			.catch(err => res.apiResult(500, {
				message: err
			}))
	} catch (e) {
		res.apiResult(500, {
			message: e
		})
	}
}))

/*
router.post('/post/like', (req, res) => {
	
})

router.get('/user/posts', (req, res) => {
	likes
})

router.get('/user', (req, res) => {
	
})

router.get('/profile', (req, res) => {
	
})
*/

export default router