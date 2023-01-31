import sanitize from 'mongo-sanitize'
import crypto from 'crypto'
import mongoose from 'mongoose'

import { validateText } from '../util'

import User from '../models/User'
import UserSession from '../models/UserSession'
import Profile from '../models/Profile'
import config from '../constants/config'

const deserializeUser = user => ({
	userId: user.userId.toHexString(),
	isAdmin: user.isAdmin,
	isMod: user.isMod,
	created: user.created
})

const deserializeProfile = profile => ({
	userId: profile.userId.toHexString(),
	username: profile.username,
	name: profile.name,
	verificationLevel: profile.verificationLevel,
	avatar: profile.avatar,
	bannerPhoto: profile.bannerPhoto,
	bio: profile.bio,
	website: profile.website,
	lastActive: profile.lastActive
})

const getUserIdFromSession = async sessionId => {
	const user = await UserSession.findOne({ _id: sanitize(sessionId) })
	
	if (!user) throw 'Could not find session'
	if (user.isDeleted) throw 'Session is invalid'
	
	return user.userId.toHexString()
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
	
	return sessionId
}

const authenticate = async req => {
	const { email, password } = req.fields
	
	const user = await User.findOne({ email: sanitize(email) })
	
	if (!user || !await user.validPassword(password)) {
		throw 'Please try another email or password'
	}
	
	const userId = user.userId.toHexString()
	
	return {
		user: deserializeUser(user),
		sessionId: await createSession(req, userId)
	}
}

const authenticateSession = async sessionId => {
	const userId = await getUserIdFromSession(sessionId)
	const user = await getUserFromUserId(userId)
	
	if (!user) throw 'Could not get user data'
	
	return user
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
	
	return {
		user: deserializeUser(user),
		profile: deserializeProfile(profile),
		sessionId: createSession(req, userId)
	}
}

const getUserFromUserId = async userId => {
	const user = await User.findOne({ _id: sanitize(userId) })
	
	if (!user) throw 'User does not exist'
	
	return deserializeUser(user)
}

const getProfileFromUserId = async userId => {
	const profile = await Profile.findOne({ _id: sanitize(userId) })
	
	if (!profile) throw 'Profile does not exist'
	
	return deserializeProfile(profile)
}

export {
	emailExists,
	getUserIdFromSession,
	authenticate, authenticateSession,
	createAccount,
	getUserFromUserId,
	getProfileFromUserId
}