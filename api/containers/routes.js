
import { Router } from 'express'

import { asyncMiddleware } from '../util'

import {
	authenticate,
	createAccount,
	getProfileFromUserId,
	getUserIdFromSession,
	getUserFromSession
} from './users'
import { createPost } from './posts'

const router = Router()

router.get('/ping', (_req, res) => res.json({ pong: true }))

router.get('/user', asyncMiddleware(async (req, res) => {
	if (!res.getFields([ 'userId', 'sessionId' ], true)) return
	
	try {
		const userId = await getUserIdFromSession(req.fields.sessionId)
		
		// Possible attack?
		if (!userId || req.fields.userId !== userId) throw 'Unexpected Error'
		
		const user = await getUserFromSession(req.fields.sessionId)
		
		res.apiResult(200, user)
	} catch(err) {
		res.apiResult(500, {
			message: err
		})
	}
}))

router.get('/user/profile', asyncMiddleware(async (req, res) => {
	if (!res.getFields([ 'userId' ], true)) return
	console.log(req.cookies)
	try {
		const profile = await getProfileFromUserId(req.fields.userId)
		
		res.apiResult(200, profile)
	} catch(err) {
		res.apiResult(500, {
			message: err
		})
	}
}))

router.post('/user/authenticate', asyncMiddleware(async (req, res) => {
	if (!res.getFields([ 'email', 'password' ], true)) return
	
	try {
		const result = await authenticate(req)
		
		res.apiResult(200, result)
	} catch(err) {
		res.apiResult(401, {
			message: err
		})
	}
}))

router.post('/user/authenticate_session', asyncMiddleware(async (req, res) => {
	if (!res.getFields([ 'sessionId' ], true)) return
	
	try {
		const user = await getUserFromSession(req.fields.sessionId)
		
		res.apiResult(200, user)
	} catch(err) {
		res.apiResult(401, {
			message: err
		})
	}
}))

router.post('/user/new', asyncMiddleware(async (req, res) => {
	if (!res.getFields([ 'name', 'email', 'password' ], true)) return
	
	try {
		const account = await createAccount(req)
		
		res.apiResult(200, account)
	} catch(err) {
		res.apiResult(500, {
			message: err
		})
	}
}))

router.post('/post/new', asyncMiddleware(async (req, res) => {
	if (!res.getFields([ 'sessionId', 'body' ], true)) return
	
	try {
		const userId = await getUserIdFromSession(req.fields.sessionId)
		
		try {
			const post = await createPost(userId, req.fields)
			
			res.apiResult(200, post)
		} catch(err) {
			res.apiResult(500, {
				message: err
			})
		}
	} catch(err) {
		res.apiResult(401, {
			message: err
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

*/

export default router