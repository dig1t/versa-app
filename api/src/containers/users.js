import sanitize from 'mongo-sanitize'
import crypto from 'crypto'
import mongoose from 'mongoose'

import { validateText } from '../util/index.js'

import User from '../models/User.js'
import UserSession from '../models/UserSession.js'
import Profile from '../models/Profile.js'

import config from '../constants/config.js'

const deserializeUser = user => ({
	userId: user.userId.toHexString(),
	email: user.email,
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
	const refreshToken = await req.oauth.issueRefreshToken(
		grant.grantId
	)
	
	return {
		user: deserializeUser(user),
		profile: deserializeProfile(profile),
		grantId: grant.grantId,
		refreshTokenId: refreshToken
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
	userIdExists,
	getUserIdFromSession,
	getUserFromUserId,
	getProfileFromUserId,
	getUserFromSession,
	authenticateUserCredentials,
	createAccount,
	deleteAccount
}