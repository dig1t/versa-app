import { Router } from 'express'
import passport from 'passport'
import { Strategy as LocalStrategy } from 'passport-local'

import api from '../../src/util/api.js'
import { authMiddleware } from '../util/index.js'

const router = Router()

router.use(authMiddleware)

api.setOption('withCredentials', false)

const logoutMiddleware = async (req, _, next) => {
	await req.logout()
	
	next()
}

// TODO: DEPRECATED
const apiFieldMiddleware = (req, _, next) => {
	const data = req.body?.data
	
	data && Object.entries(data).forEach(([key, value]) => {
		req.body[key] = value
	})
	
	next()
}

const deserializeAuthorizedUser = user => ({
	userId: user.userId,
	isAdmin: user.isAdmin,
	isAdmin: user.isMod
})

// Extract the userId from the auth strategy
passport.serializeUser((data, done) => {
	done(null, {
		userId: data.user.userId,
		sessionId: data.sessionId
	})
})

// Call the API to retrieve basic info about the user
passport.deserializeUser((user, done) => {
	api.get('/v1/user', {
		userId: user.userId,
		sessionId: user.sessionId
	})
		.then(data => done(null, {
			userId: user.userId,
			isAdmin: data.isAdmin,
			isMod: data.isMod,
			sessionId: user.sessionId
		}))
		.catch(e => done(e, {}))
})

/* Define Authentication Methods */
passport.use('local', new LocalStrategy(
	{ usernameField: 'email' },
	(email, password, done) => {
		try {
			api.post('/v1/user/authenticate', { email, password })
				.then(data => done(null, data))
				.catch(error => done(null, false, { message: error }))
		} catch(e) {
			done(null, false, { message: 'Server error!!!111' })
		}
	}
))

/* Define Routes */
router.post('/auth/logout', async (req, res) => {
	try {
		await req.logout()
		
		res.send({
			success: true
		})
	} catch(e) {
		res.status(500).json({
			success: false
		})
	}
})

router.post(
	'/auth/login',
	logoutMiddleware, // Clear session/cookie data if logged in
	apiFieldMiddleware,
	(req, res) => passport.authenticate('local', async (_, data) => {
		try {
			console.log('auth data', data)
			await req.loginUser(data)
			
			res.send({
				success: true,
				data: deserializeAuthorizedUser(data.user),
			})
		} catch(e) {
			res.status(401).json({
				success: false,
				message: 'Could not authenticate'
			})
		}
	})(req, res)
)

router.post(
	'/auth/signup',
	async (req, res) => {
		if (req.isAuthenticated()) return res.status(400).send({
			success: false,
			message: 'Already logged in'
		})
		
		try {
			const data = api.post('/v1/user/new', req.body.data)
			
			await req.loginUser(data)
			
			res.send({
				success: true,
				data: {
					user: deserializeAuthorizedUser(data.user),
					profile: data.profile
				}
			})
		} catch(e) {
			res.status(500).send({
				success: false,
				message: `Error while signing up ${e}`
			})
		}
	}
)

router.get('/auth/get_user', (req, res) => {
	req.isAuthenticated() ? res.json({
		success: true,
		data: deserializeAuthorizedUser(req.user)
	}) : res.status(401).json({
		success: false,
		message: 'Not logged in'
	})
})

export default router