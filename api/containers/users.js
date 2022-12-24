import mongoose, { mongo } from 'mongoose'
import sanitize from 'mongo-sanitize'
import crypto from 'crypto'

import { validateText } from '../util'

import User from '../models/User'
import UserSession from '../models/UserSession'
import Profile from '../models/Profile'

const getUserIdFromSession = sessionId => new Promise(async (resolve, reject) => {
	UserSession.findOne({ sessionId })
		.then(result => {
			const userId = result && result.userId.toHexString()
			
			if (userId) {
				(!result.isDeleted) ? resolve(userId) : reject('Session is invalid')
			}
		})
		.catch(e => reject(e))
})

const emailExists = async email => {
	const count = await User.countDocuments({ email: sanitize(email) })
	
	return count > 0 ? true : false
}

const userIdExists = async userId => {
	const count = await User.countDocuments({ userId })
	
	return count > 0 ? true : false
}

const createSession = (req, userId) => new Promise(async (resolve, reject) => {
	if (await userIdExists(userId)) {
		const sessionId = crypto.randomBytes(12).toString('hex')
		console.log(req.ip,req.headers['user-agent'])
		const session = UserSession({
			_id: sessionId,
			userId,
			//agent: req.headers['user-agent'],
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
	const { email, password } = req.query
	
	User.findOne({email: sanitize(email)})
		.then(async user => {
			if (!user || !await user.validPassword(password)) {
				return reject('Please try another email or password')
			}
			
			createSession(req, user.userId)
				.then(sessionId => resolve({
					user: {
						userId: user.userId,
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

const createAccount = req => new Promise(async (resolve, reject) => {
	const { name, email, password } = req.query
	
	if (name.length > 30 || !validateText(name, 'name')) {
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
	authenticate, createAccount
}