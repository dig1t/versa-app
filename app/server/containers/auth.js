import { Router } from 'express'
import passport from 'passport'
import { Strategy as LocalStrategy } from 'passport-local'

import { apiGet, apiPost } from '../../src/util/api'

const router = Router()

const logoutMiddleware = (req, _, next) => req.isAuthenticated() ? req.logout(() => {
	req.loggedUserOut = true
	
	next()
}) : next()

const apiFieldMiddleware = (req, _, next) => {
	const data = req.body?.data
	
	Object.entries(data).forEach(([key, value]) => {
		req.body[key] = value
	})
	
	next()
}

// Extract the userId from the auth strategy
passport.serializeUser((data, done) => done(null, {
	userId: data.user.userId,
	sessionId: data.sessionId
}))

// Call the API to retrieve basic info about the user
passport.deserializeUser((user, done) => {
	apiGet('/user', { userId: user.userId })
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
	{ usernameField: 'email' }, (email, password, done) => {
		try {
			apiPost('/user/authenticate', { email, password })
				.then(data => done(null, data))
				.catch(error => done(null, false, { message: error }))
		} catch(e) {
			done(null, false, { message: 'Server error!!!111' })
		}
	}
))

/* Define Routes */
router.post('/auth/logout', (req, res) => {
	req.logout(() => {
		req.session.destroy()
		res.send({
			success: true
		})
	})
})

router.post(
	'/auth/login',
	logoutMiddleware,
	apiFieldMiddleware,
	(req, res) => passport.authenticate('local', (_, user) => {
		user ? req.login(user, () => res.send({
			success: true,
			data: {
				userId: req.user.userId,
				isAdmin: req.user.isAdmin
			}
		})) : res.send({
			success: false,
			message: 'Not logged in'
		})
	})(req, res)
)

router.post(
	'/auth/signup',
	apiFieldMiddleware,
	(req, res) => {
		if (req.isAuthenticated()) return res.send({
			success: false,
			message: 'Already logged in'
		})
		
		apiPost('/user/new', req.body.data)
			.then(data => done(null, {
				userId: user.userId,
				isAdmin: data.isAdmin,
				isMod: data.isMod,
				sessionId: user.sessionId
			}))
			.catch(e => done(e, {}))
		
		const data = req.body?.data
		
		if (data.email && data.password) {
			req.body.email = data.email
			req.body.password = data.password
		}
		
		passport.authenticate('local', (_, user) => {
			user ? req.login(user, () => res.send({
				success: true,
				data: {
					userId: req.user.userId,
					isAdmin: req.user.isAdmin
				}
			})) : res.send({
				success: false,
				message: 'Not logged in'
			})
		})(req, res)
	}
)

router.get('/auth/get_user', (req, res) => res.send(req.isAuthenticated() ? {
	success: true,
	data: {
		userId: req.user.userId,
		isAdmin: req.user.isAdmin
	}
} : {
	success: false,
	message: 'Not logged in'
}))

export default router