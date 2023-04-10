/* eslint-disable no-undef */
import { Router } from 'express'
import passport from 'passport'
import { Strategy as LocalStrategy } from 'passport-local'

import config from '../config.js'
import api from '../../src/util/api.js'
import authMiddleware, { logout } from '../util/authMiddleware.js'
import apiMiddleware from '../util/apiMiddleware.js'

const router = Router()

router.use(apiMiddleware())
router.use(authMiddleware())

api.setOption('withCredentials', false)

const deserializeAuthorizedUser = user => ({
	userId: user.userId,
	email: user.email,
	isAdmin: user.isAdmin,
	isMod: user.idMod
})

// Extract the userId and sessionId from the auth strategy
passport.serializeUser((data, done) => done(null, {
	userId: data.user.userId,
	sessionId: data.auth.sessionId
}))

// Call the API to retrieve basic info about the user
passport.deserializeUser((user, done) => {
	api.get(`/v1/user/${user.userId}`, {
		sessionId: user.sessionId
	})
		.then(data => done(null, {
			userId: user.userId,
			email: data.email,
			isAdmin: data.isAdmin,
			isMod: data.isMod,
			sessionId: user.sessionId
		}))
		.catch(error => done(error, {}))
})

/* Define Authentication Methods */
passport.use('local', new LocalStrategy(
	{ usernameField: 'email' },
	(email, password, done) => {
		try {
			api.post('/v1/user/authenticate', { email, password })
				.then(data => done(null, data))
				.catch(error => done(null, false, { message: error }))
		} catch(error) {
			done(null, false, { message: 'Server error!!!111' })
		}
	}
))

/* Define Routes */
router.post('/auth/logout', async req => {
	try {
		await req.logoutUser()
		
		req.apiResult(200)
	} catch(error) {
		req.apiResult(500)
	}
})

router.post(
	'/auth/login',
	logout, // Clear session/cookie data if logged in
	(req, res) => passport.authenticate('local', async (_, data) => {
		try {
			await req.loginUser(data)
			
			req.apiResult(200, {
				user: deserializeAuthorizedUser(data.user),
				access_token: await req.getAccessToken(data.auth.refreshTokenId)
			})
		} catch(error) {
			console.log(error)
			req.apiResult(401)
		}
	})(req, res)
)

router.post(
	'/auth/signup',
	async req => {
		if (req.authenticated()) return req.apiResult(400, {
			message: 'Already logged in'
		})
		
		try {
			const data = await api.post('/v1/user/new', req.body)
			
			await req.loginUser(data)
			
			req.apiResult(200, {
				user: deserializeAuthorizedUser(data.user),
				profile: data.profile
			})
		} catch(error) {
			req.apiResult(500, {
				message: `Error while signing up ${error}`
			})
		}
	}
)

router.get(
	'/auth/get_user',
	async req => {
		try {
			if (!req.authenticated()) throw new Error('Not authenticated')
			
			const refreshToken = req.cookies?.[config.shortName.refreshToken]
			
			if (!refreshToken) throw new Error('Missing refresh token')
			
			req.apiResult(200, {
				user: deserializeAuthorizedUser(req.user),
				access_token: await req.getAccessToken(refreshToken)
			})
		} catch(error) {
			req.apiResult(200, {
				message: 'Not authenticated'
			})
		}
	}
)

export default router