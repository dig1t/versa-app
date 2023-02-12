import { Router } from 'express'

import {
	authenticate,
	createAccount,
	getProfileFromUserId,
	getUserFromSession,
	getUserFromUserId
} from './users.js'
import { createPost } from './posts.js'
import { asyncMiddleware, useFields } from '../util/index.js'

export default server => {
	const router = new Router()
	
	router.get('/ping', (_req, res) => res.json({ pong: true }))
	
	router.get(
		'/user',
		useFields({ fields: ['userId', 'sessionId'] }),
		server.oauth.authorize(),
		asyncMiddleware(async (req) => {
			try {
				const userId = req._oauth.user.userId
				
				// Possible attack?
				if (!userId || req.fields.userId !== userId) throw 'Unexpected Error'
				
				const user = await getUserFromSession(req.fields.sessionId)
				
				req.apiResult(200, user)
			} catch(err) {
				req.apiResult(500)
			}
		})
	)
	
	router.get(
		'/user/profile',
		useFields({ fields: ['userId'] }),
		asyncMiddleware(async (req, res) => {
			try {
				const profile = await getProfileFromUserId(req.fields.userId)
				
				req.apiResult(200, profile)
			} catch(err) {
				req.apiResult(500, {
					message: err
				})
			}
		})
	)
	
	router.post(
		'/user/authenticate',
		useFields({ fields: ['email', 'password'] }),
		server.oauth.useROPCGrant(),
		asyncMiddleware(async req => {
			try {
				const result = await authenticate(
					req,
					req._oauth.grant.accountId,
					req._oauth.grant.grantId
				)
				
				req.apiResult(200, {
					...result,
					user: await getUserFromUserId(req._oauth.grant.accountId)
				})
			} catch(err) {
				req.apiResult(401, {
					message: err
				})
			}
		})
	)
	
	/* router.post(
		'/user/authenticate_session',
		useFields({ fields: ['sessionId'] }),
		asyncMiddleware(async (req, res) => {
			try {
				const user = await getUserFromSession(req.fields.sessionId)
				
				req.apiResult(200, user)
			} catch(err) {
				req.apiResult(401, {
					message: err
				})
			}
		})
	) */
	
	router.post(
		'/user/new',
		useFields({ fields: ['name', 'email', 'password'] }),
		asyncMiddleware(async req => {
			try {
				const account = await createAccount(req)
				
				req.apiResult(200, account)
			} catch(err) {
				req.apiResult(500, {
					message: err
				})
			}
		})
	)
	
	router.post(
		'/post/new',
		useFields({ fields: ['body'] }),
		server.oauth.authorize(),
		asyncMiddleware(async req => {
			try {
				const post = await createPost(req._oauth.user.userId, req.fields)
				
				req.apiResult(200, post)
			} catch(err) {
				req.apiResult(500, {
					message: err
				})
			}
		})
	)
	
	/*
	router.post('/post/like', (req, res) => {
		
	})
	
	router.get('/user/posts', (req, res) => {
		likes
	})
	
	router.get('/user', (req, res) => {
		
	})
	*/
	
	return router
}