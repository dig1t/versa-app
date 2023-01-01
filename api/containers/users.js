import sanitize from 'mongo-sanitize'
import crypto from 'crypto'
import mongoose from 'mongoose'

import { validateText } from '../util'

import User from '../models/User'
import UserSession from '../models/UserSession'
import Profile from '../models/Profile'

const getUserIdFromSession = sessionId => new Promise(async (resolve, reject) => {
	UserSession.findOne({ sessionId: sanitize(sessionId) })
		.then(user => {
			const userId = user && user.userId.toHexString()
			
			if (userId) {
				(!user.isDeleted) ? resolve(userId) : reject('Session is invalid')
			} else {
				reject('Session not found')
			}
		})
		.catch(() => reject('Could not find session'))
})

const emailExists = async email => {
	const count = await User.countDocuments({ email: sanitize(email) })
	
	return count > 0 ? true : false
}

const userIdExists = async userId => {
	const count = await User.countDocuments({ _id: userId })
	
	return count > 0 ? true : false
}

const getUserFromUserId = userId => new Promise(async (resolve, reject) => {
	User.findOne({ _id: sanitize(userId) })
		.then(user => {
			user ? resolve({
				userId: user.userId.toHexString(),
				isAdmin: user.isAdmin,
				isMod: user.isMod,
				createdAt: user.createdAt
			}) : reject('User ID is invalid')
		})
		.catch(e => reject(e))
})

const createSession = (req, userId) => new Promise(async (resolve, reject) => {
	if (await userIdExists(userId)) {
		const sessionId = new mongoose.Types.ObjectId()
		const session = UserSession({
			sessionId,
			userId,
			agent: req.headers['user-agent'],
			ip: req.ip
		})
		
		session.save()
			.then(() => resolve(sessionId))
			.catch(e => reject(e))
	} else {
		reject('User does not exist')
	}
})

const authenticate = req => new Promise(async (resolve, reject) => {
	const { email, password } = req.fields
	
	User.findOne({ email: sanitize(email) })
		.then(async user => {
			if (!user || !await user.validPassword(password))
				return reject('Please try another email or password')
			
			const userId = user.userId.toHexString()
			
			createSession(req, userId)
				.then(sessionId => resolve({
					user: {
						userId: userId,
						isAdmin: user.isAdmin,
						isMod: user.isMod,
						createdAt: user.createdAt
					},
					sessionId
				}))
				.catch(e => reject(e))
		})
		.catch(e => reject(e))
})

const authenticateSession = sessionId => new Promise(async (resolve, reject) => {
	getUserIdFromSession(sessionId)
		.then(async userId => {
			getUserFromUserId(userId)
				.then(user => resolve(user))
				.catch(() => reject('Could not get user data'))
		})
		.catch(e => reject(e))
})

const createAccount = req => new Promise(async (resolve, reject) => {
	const { name, email, password } = req.fields
	
	if (name.length > 20 || !validateText(name, 'name')) {
		reject('Name is invalid')
	} else if (email.length > 320 || !validateText(email, 'email')) {
		reject('Email is invalid')
	} else if (password.length > 9999 || !validateText(password, 'password')) {
		reject('Password does not meet requirements')
	} else if (await emailExists(email)) {
		reject('E-mail in use')
	} else {
		const userId = crypto.randomBytes(12).toString('hex')
		const users = await User.find().countDocuments()
		
		const user = new User({
			_id: userId,
			email,
			isAdmin: users === 0
		})
		
		user.password = await user.hashString(password)
		
		user.save()
			.then(() => {
				const userId = user.userId
				
				const profile = new Profile({
					userId,
					name,
					user: user._id,
					username: userId
				})
				
				profile.save()
					.then(() => {
						createSession(req, userId)
							.then(sessionId => {
								resolve({ userId, sessionId })
							})
							.catch(e => reject(e))
					})
					.catch(e => reject(e))
			})
			.catch(e => reject(e))
	}
})

export {
	emailExists,
	getUserIdFromSession,
	getUserFromUserId,
	authenticate, authenticateSession,
	createAccount
}