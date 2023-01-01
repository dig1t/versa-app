import axios from 'axios'
import { Router } from 'express'
import passport from 'passport'
import { Strategy as LocalStrategy } from 'passport-local'

const router = Router()

const BASE_URL = 'http://localhost:81/v1'

// Extract the userId from the auth strategy
passport.serializeUser((data, done) => done(null, {
	userId: data.user.userId,
	sessionId: data.sessionId
}))

// Call the API to retrieve basic info about the user
passport.deserializeUser((user, done) => {
	try {
		axios.get(BASE_URL + '/user',
			{ data: { data: { userId: user.userId } } }
		)
			.then(response => {
				done(null, response.data)
			})
			.catch(e => done(e, {}))
	} catch(e) {
		done(e, {})
	}
})

/* Define Authentication Methods */
passport.use('local', new LocalStrategy(
	{ usernameField: 'email' }, (email, password, done) => {
		try {
			axios.post(BASE_URL + '/user/authenticate', {
				data: { email, password }
			})
				.then(response => {
					response.success ? done(null, response.data) : done(response.data.message, null)
				})
				.catch(e => done(e))
		} catch(e) {
			done(e)
		}
	}
))

/* Define Routes */
router.get('/auth/get_user', (req, res) => res.send(req.user && {
	userId: req.user.userId,
	isAdmin: req.user.isAdmin
}))

router.post('/auth/logout', (req, res) => {
	req.logout(err => {
		if (err) return next(err)
		
		req.session.destroy()
		res.redirect(307, '/')
	})
})

router.post(
	'/auth/login',
	passport.authenticate('local'), (req, _) => res.send(req.user)
)

export default {
	router,
	session: () => {
		router.use(passport.initialize())
		router.use(passport.session()) // must be run after express-session
	}
}