
import { Router } from 'express'

import { asyncMiddleware } from '../util'

import { authenticate, createAccount, getUserIdFromSession } from './users'
import { createPost } from './posts'

const router = Router()

router.get('/ping', (_req, res) => {
	res.json({ pong: true })
})

router.post('/user/authenticate', asyncMiddleware(async (req, res) => {
	if (!res.checkForFields([ 'email', 'password' ], true)) return
	
	authenticate(req)
		.then(result => res.apiResult(200, result))
		.catch(err => {
		
		console.log(err.fileName, err.fileNumber,err.toString())
		res.apiResult(401, {
			message: err
		})
		})
}))

router.post('/user/new', asyncMiddleware(async (req, res) => {
	if (!res.checkForFields([ 'name', 'email', 'password' ], true)) return
	
	createAccount(req)
		.then(result => res.apiResult(200, result))
		.catch(err => res.apiResult(500, {
			message: err
		}))
}))

router.post('/post/new', asyncMiddleware(async (req, res) => {
	if (!res.checkForFields([ 'sessionId', 'text' ], true)) return
	
	if (!req.query.sessionId) return res.apiResult(400, {
		message: 'Missing sessionId'
	})
	
	try {
		const userId = await getUserIdFromSession(req.query.sessionId)
		
		if (userId) createPost(userId, req.query)
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