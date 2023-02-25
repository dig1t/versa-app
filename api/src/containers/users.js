import { Router } from 'express'
import sanitize from 'mongo-sanitize'
import crypto from 'crypto'
import mongoose from 'mongoose'

import User from '../models/User.js'
import UserSession from '../models/UserSession.js'
import Profile from '../models/Profile.js'

import config from '../constants/config.js'
import { validateText } from '../util/index.js'
import useFields from '../util/useFields.js'
import {
	deserializeProfile
} from './profiles.js'

const deserializeUser = user => ({
	userId: (user.userId && user.userId.toHexString()) || (user._id && user._id.toHexString()),
	isAdmin: user.isAdmin || false,
	isMod: user.isMod || false,
	created: user.created
})

const getUserFromUserId = async userId => {
	const user = await User.findOne({ _id: sanitize(userId) })
	
	if (!user) throw 'User does not exist'
	
	return deserializeUser(user)
}

const getUserIdFromSession = async sessionId => {
	const user = await UserSession.findOne({ _id: sanitize(sessionId) })
	
	if (!user) throw 'Could not find session'
	if (user.isDeleted) throw 'Session is invalid'
	
	return user.userId.toHexString()
}

const getUserFromSession = async sessionId => {
	const userId = await getUserIdFromSession(sessionId)
	const user = await getUserFromUserId(userId)
	
	return user
}

const emailExists = async email => {
	const count = await User.countDocuments({ email: sanitize(email) })
	
	return count > 0 ? true : false
}

const userIdExists = async userId => {
	const count = await User.countDocuments({ _id: userId })
	
	return count > 0 ? true : false
}

const createSession = async (req, userId) => {
	if (!await userIdExists(userId)) throw 'User does not exist'
	
	const sessionId = new mongoose.Types.ObjectId()
	const session = UserSession({
		sessionId,
		userId,
		agent: req.headers['user-agent'],
		ip: req.ip
	})
	
	try {
		await session.save()
	} catch(e) {
		throw 'Could not create session'
	}
	
	return sessionId.toHexString()
}

const authenticate = async (req, userId, _grantId) => {
	const grantId = _grantId || req._oauth?.grant?.grantId
	
	if (!grantId) throw 'User grant missing'
	
	const sessionId = await createSession(req, userId)
	const refreshToken = await req.oauth.issueRefreshToken(
		grantId
	)
	
	return {
		sessionId,
		grantId,
		refreshTokenId: refreshToken
	}
}

const authenticateUserCredentials = async (email, password) => {
	const user = await User.findOne({ email: sanitize(email) })
	
	if (!user || !await user.validPassword(password)) {
		throw 'Please try another email or password'
	}
	
	return deserializeUser(user)
}

const createAccount = async req => {
	const { name, email, password } = req.fields
	
	if (name.length > config.user.maxNameLength || !validateText(name, 'name')) {
		throw 'Name is invalid'
	} else if (email.length > config.user.maxEmailLength || !validateText(email, 'email')) {
		throw 'Email is invalid'
	} else if (password.length > config.user.maxPasswordLength || !validateText(password, 'password')) {
		throw 'Password does not meet requirements'
	} else if (await emailExists(email)) {
		throw 'E-mail in use'
	}
	
	const userId = crypto.randomBytes(12).toString('hex')
	
	const user = new User({
		userId,
		email
	})
	
	user.password = await user.hashString(password)
	
	try {
		await user.save()
	} catch(e) {
		throw 'Could not create user'
	}
	
	const profile = new Profile({
		userId,
		name
	})
	
	try {
		await profile.save()
	} catch(e) {
		throw 'Could not create profile'
	}
	
	// Issue user an oauth grant and refresh token
	const grant = await req.oauth.ROPCGrant(email, password)
	const auth = await authenticate(req, userId, grant.grantId)
	
	return {
		auth,
		user: deserializeUser(user),
		profile: deserializeProfile(profile)
	}
}

const deleteAccount = async userId => {
	const user = await User.findOne({ _id: sanitize(userId) })
	
	if (!user) throw 'Could not find user'
	
	try {
		await User.deleteOne({ _id: user._id })
	} catch(e) {
		throw 'Could not delete user'
	}
}

export {
	emailExists,
	getUserIdFromSession,
	getUserFromUserId,
	getUserFromSession,
	createSession,
	authenticate,
	authenticateUserCredentials,
	createAccount,
	deleteAccount
}

export default server => {
	const router = new Router()
	
	router.get(
		'/user',
		useFields({ fields: ['userId', 'sessionId'] }),
		server.oauth.authorize({ optional: true }),
		async (req) => {
			try {
				const user = await getUserFromSession(req.fields.sessionId)
				
				// Possible attack
				if (user.userId !== req.fields.userId) throw 'Unexpected Error'
				
				req.apiResult(200, user)
			} catch(err) {
				req.apiResult(500)
			}
		}
	)
	
	router.post(
		'/user/authenticate',
		useFields({ fields: ['email', 'password'] }),
		server.oauth.useROPCGrant(),
		async req => {
			try {
				const auth = await authenticate(
					req,
					req._oauth.grant.accountId,
					req._oauth.grant.grantId
				)
				
				req.apiResult(200, {
					auth,
					user: await getUserFromUserId(req._oauth.grant.accountId)
				})
			} catch(err) {
				req.apiResult(401, {
					message: err
				})
			}
		}
	)
	
	/* router.post(
		'/user/authenticate_session',
		useFields({ fields: ['sessionId'] }),
		async (req, res) => {
			try {
				const user = await getUserFromSession(req.fields.sessionId)
				
				req.apiResult(200, user)
			} catch(err) {
				req.apiResult(401, {
					message: err
				})
			}
		}
	) */
	
	router.post(
		'/user/new',
		useFields({ fields: ['name', 'email', 'password'] }),
		async req => {
			try {
				const account = await createAccount(req)
				
				req.apiResult(200, account)
			} catch(err) {
				console.log(err)
				req.apiResult(500, {
					message: err
				})
			}
		}
	)
	
	/*
	router.get('/user/posts', (req, res) => {
		likes
	})
	
	router.get('/user', (req, res) => {
		
	})
	*/
	
	return router
}