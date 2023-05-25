import crypto from 'crypto'
import mongoose from 'mongoose'

import User from '../models/User.js'
import UserSession from '../models/UserSession.js'
import Profile from '../models/Profile.js'
import Setting from '../models/Setting.js'

import config from '../constants/config.js'
import { ObjectIdToString, mongoSanitize, mongoSession } from '../util/mongoHelpers.js'
import validateText from '../util/validateText.js'
import {
	deserializeProfile
} from './profileService.js'
import { deserializeSettings } from './settingService.js'

const deserializeUser = (user, settings) => ({
	userId: (user.userId && ObjectIdToString(user.userId)) || (user._id && ObjectIdToString(user._id)),
	email: user.email,
	isAdmin: user.isAdmin || false,
	isMod: user.isMod || false,
	created: user.created,
	
	settings: settings || user.settings
})

const getUserFromUserId = async (userId) => {
	const user = await User.findOne({ _id: mongoSanitize(userId) })
	
	if (!user) throw new Error('User does not exist')
	
	return deserializeUser(user)
}

const getUserIdFromSession = async (sessionId) => {
	const user = await UserSession.findOne({ _id: mongoSanitize(sessionId) })
	
	if (!user) throw new Error('Could not find session')
	if (user.isDeleted) throw new Error('Session is not valid')
	
	return ObjectIdToString(user.userId)
}

const getUserFromSession = async (sessionId) => {
	const userId = await getUserIdFromSession(sessionId)
	const user = await getUserFromUserId(userId)
	
	return user
}

const emailExists = async (email) => {
	const count = await User.countDocuments({ email: mongoSanitize(email) })
	
	return count > 0 ? true : false
}

const userIdExists = async (userId) => {
	const count = await User.countDocuments({ _id: userId })
	
	return count > 0 ? true : false
}

const createSession = async (req, userId) => {
	if (!await userIdExists(userId)) throw new Error('User does not exist')
	
	const sessionId = new mongoose.Types.ObjectId()
	const session = UserSession({
		sessionId,
		userId,
		agent: req.headers['user-agent'],
		ip: req.ip
	})
	
	try {
		await session.save()
	} catch(error) {
		throw new Error('Could not create session')
	}
	
	return ObjectIdToString(sessionId)
}

const authenticate = async (req, userId, _grantId) => {
	const grantId = _grantId || req._oauth?.grant?.grantId
	
	if (!grantId) throw new Error('User grant missing')
	
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
	const user = await User.findOne({ email: mongoSanitize(email) })
	
	if (!user || !await user.validPassword(password)) {
		throw new Error('Please try another email or password')
	}
	
	return deserializeUser(user)
}

const createAccount = async (req) => {
	const { name, email, password } = req.fields
	
	if (name.length > config.user.maxNameLength || !validateText(name, 'name')) {
		throw new Error('Name is not valid')
	} else if (email.length > config.user.maxEmailLength || !validateText(email, 'email')) {
		throw new Error('Email is not valid')
	} else if (password.length > config.user.maxPasswordLength || !validateText(password, 'password')) {
		throw new Error('Password does not meet requirements')
	} else if (await emailExists(email)) {
		throw new Error('E-mail in use')
	}
	
	return await mongoSession(async () => {
		const userId = crypto.randomBytes(12).toString('hex')
		
		const user = new User({
			userId,
			email
		})
		const profile = new Profile({
			userId,
			name
		})
		const settings = new Setting({
			userId
		})
		
		user.password = await user.hashString(password)
		
		await Promise.all([
			user.save(),
			profile.save(),
			settings.save()
		])
		
		// Issue user an oauth grant and refresh token
		const grant = await req.oauth.ROPCGrant(email, password)
		const auth = await authenticate(req, userId, grant.grantId)
		
		return {
			auth,
			user: deserializeUser(user, deserializeSettings(settings)),
			profile: deserializeProfile(profile)
		}
	})
}

const deleteAccount = async (userId) => {
	const user = await User.findOne({ _id: mongoSanitize(userId) })
	
	if (!user) throw new Error('Could not find user')
	
	try {
		await mongoSession(async () => {
			await User.deleteOne({ _id: user._id })
		})
		
		return { deleted: true }
	} catch(error) {
		throw new Error('Could not delete user')
	}
}

const emailIsFree = async (email) => {
	if (!validateText(email, 'email')) return false
	
	const user = await User.findOne({ email: mongoSanitize(email) })
		.select('email')
	
	if (user && typeof user.email === 'string') {
		return false
	}
	
	return true
}

const usernameIsFree = async (username) => {
	if (!validateText(username, 'username')) return false
	
	const profile = await Profile.findOne({ username: mongoSanitize(username) })
		.select('username')
	
	if (profile && typeof profile.username === 'string') {
		return false
	}
	
	return true
}

const updateEmail = async (userId, newEmail) => {
	try {
		if (!emailIsFree(newEmail)) throw new Error('Email already exists!')
		
		// TODO: Keep track of email updates
		
		return await mongoSession(async () => {
			// TODO: Save to user activity logs as type: user:update_email
			
			await User.updateOne(
				{ _id: mongoSanitize(userId) },
				{ $set: { 'email': mongoSanitize(newEmail) } }
			)
			
			return { updatedValue: 'email' }
		})
	} catch(error) {
		throw new Error(error || 'Could not update user email')
	}
}

const updateUsername = async (userId, newUsername) => {
	try {
		if (!usernameIsFree(newUsername)) throw new Error('Username already exists!')
		
		// TODO: Keep track of username updates, limit to once per 2 weeks
		
		/* if (!userCanUpdateUsername(userId)) {
			throw new Error('You may only update once per 2 weeks')
		}*/
		
		return await mongoSession(async () => {
			// TODO: Save to user activity logs as type: profile:update_username
			
			await Profile.updateOne(
				{ _id: mongoSanitize(userId) },
				{ $set: { 'username': mongoSanitize(newUsername) } }
			)
			
			return { updatedValue: 'username' }
		})
	} catch(error) {
		throw new Error(error || 'Could not update profile username')
	}
}

const updatePassword = async (userId, newPassword) => {
	if (
		newPassword.length > config.user.maxPasswordLength ||
		newPassword.length < 5 ||
		!validateText(newPassword, 'password')
	) {
		throw new Error('Password does not meet requirements')
	}
	
	try {
		const user = await User.findOne({ _id: mongoSanitize(userId) })
		
		if (!user) throw new Error('Could not find user')
		
		return await mongoSession(async () => {
			// TODO: Save to user activity logs as type: user:update_email
			
			user.password = await user.hashString(newPassword)
			
			await user.save()
			
			return { updatedValue: 'password' }
		})
	} catch(error) {
		throw new Error(error || 'Could not update user password')
	}
}

const updateProfile = async (options) => {
	if (typeof options.userId !== 'string') throw new Error('Missing userId')
	if (typeof options.key !== 'string') throw new Error('Missing key')
	if (options.value === undefined) throw new Error('Missing value')
	if (typeof options.validateFor !== 'string') throw new Error('Missing validation type')
	
	const isValid = validateText(
		options.value,
		options.validateFor || 'text'
	)
	
	if (!isValid) {
		throw new Error(`Text is not a valid ${options.validateFor}`)
	}
	
	try {
		// TODO: Keep track of updates
		
		return await mongoSession(async () => {
			// TODO: Save to user activity logs as type: profile:update_${key}
			
			await Profile.updateOne(
				{ _id: mongoSanitize(options.userId) },
				{ $set: { [options.key]: mongoSanitize(options.value) } }
			)
			
			return { [options.key]: options.value }
		})
	} catch(error) {
		throw new Error(error || 'Could not update profile')
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
	deleteAccount,
	updateUsername,
	updateEmail,
	updatePassword,
	updateProfile
}