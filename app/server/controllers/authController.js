import passport from 'passport'
import { Strategy as LocalStrategy } from 'passport-local'

import config from '../config.js'
import api from '../../src/util/api.js'

api.setOption('withCredentials', false)

const deserializeAuthorizedUser = (user) => ({
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
passport.deserializeUser(async (user, done) => {
	try {
		const userData = await api.get(`/v1/user/${user.userId}`, {
			sessionId: user.sessionId
		})
		
		done(null, {
			userId: user.userId,
			email: userData.email,
			isAdmin: userData.isAdmin,
			isMod: userData.isMod,
			sessionId: user.sessionId
		})
	} catch(error) {
		if (config.dev) console.error(error)
		
		done(error, {})
	}
})

/* Define Authentication Methods */
passport.use('local', new LocalStrategy(
	{ usernameField: 'email' },
	(email, password, done) => {
		try {
			api.post('/v1/user/authenticate', { email, password })
				.then((data) => done(null, data))
				.catch((error) => done(null, false, { message: error }))
		} catch(error) {
			done(null, false, { message: 'Server error!!!111' })
		}
	}
))

export default {
	postLogout: async (req) => {
		try {
			await req.logoutUser()
			
			req.apiResult(200)
		} catch(error) {
			req.apiResult(500)
		}
	},

	postLogin: (req, res) => passport.authenticate('local', async (_, data) => {
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
	})(req, res),

	postSignup: async (req) => {
		if (req.authenticated()) return req.apiResult(400, {
			message: 'Already logged in'
		})
		
		try {
			const data = await api.post('/v1/user/new', req.body)
			
			await req.loginUser(data)
			
			req.apiResult(200, {
				access_token: await req.getAccessToken(data.auth.refreshTokenId),
				user: deserializeAuthorizedUser(data.user),
				profile: data.profile
			})
		} catch(error) {
			req.apiResult(500, {
				message: `Error while signing up ${error}`
			})
		}
	},

	getUser: async (req) => {
		try {
			console.log('get user')
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
}