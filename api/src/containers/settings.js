import { Router } from 'express'

import Setting from '../models/Setting.js'

import { mongoSanitize, validateText } from '../util/index.js'
import useFields from '../util/useFields.js'
import { updateEmail, updatePassword, updateProfile, updateUsername } from './users.js'

const shortcuts = {
	appTheme: ['light', 'dark']
}

class ActionHandler {
	constructor() {
		this.actions = {}
	}
	
	register(name, callback) {
		this.actions[name] = callback
	}
	
	async fire(type, value, userId) {
		if (this.actions[type] === 'undefined') throw new Error('Missing action')
		
		try {
			return await this.actions[type].apply(null, [value, userId])
		} catch(error) {
			console.log(error)
			
			throw new Error(`Error while updating setting ${type}`)
		}
	}
	
	async run(data, userId) {
		const promises = []
		
		for (const type in data) {
			if (typeof this.actions[type] === 'function') {
				promises.push(this.fire(type, data[type], userId))
			}
		}
		
		const res = await Promise.allSettled(promises)
		
		return res.reduce((result, promise) => ({
			...result,
			...promise.value
		}), {})
	}
}

const handler = new ActionHandler()

handler.register(
	'email',
	async (value, userId) => updateEmail(userId, value)
)

handler.register(
	'username',
	async (value, userId) => updateUsername(userId, value)
)

handler.register(
	'password',
	async (value, userId) => updatePassword(userId, value)
)

handler.register(
	'profile_private',
	async (value, userId) => updateProfile({
		userId,
		key: 'private',
		value,
		validateFor: 'bool'
	})
)

handler.register(
	'profile_name',
	async (value, userId) => updateProfile({
		userId,
		key: 'name',
		value,
		validateFor: 'name'
	})
)

handler.register(
	'profile_bio',
	async (value, userId) => updateProfile({
		userId,
		key: 'bio',
		value,
		validateFor: 'text'
	})
)

handler.register(
	'profile_website',
	async (value, userId) => updateProfile({
		userId,
		key: 'website',
		value,
		validateFor: 'website'
	})
)

export const deserializeSettings = settings => ({
	appTheme: shortcuts.appTheme[settings.appTheme || 0]
})

const getSettingsFromUserId = async userId => {
	const settings = await Setting.findOne({ _id: mongoSanitize(userId) })
	
	if (!settings) throw new Error('Could not get user settings')
	
	return deserializeSettings(settings)
}

export default server => {
	const router = new Router()
	
	router.get(
		'/user/:userId/settings',
		server.oauth.authorize(),
		async (req) => {
			if (req._oauth.user.userId !== req.params.userId) throw new Error('Unexpected Error')
			
			try {
				const settings = await getSettingsFromUserId(req._oauth.user.userId)
				
				req.apiResult(200, settings)
			} catch(error) {
				req.apiResult(500, {
					message: error
				})
			}
		}
	)
	
	router.post(
		'/user/:userId/settings',
		server.oauth.authorize(),
		useFields(),
		async (req) => {
			if (req._oauth.user.userId !== req.params.userId) throw new Error('Unexpected Error')
			
			if (Object.keys(req.fields).length === 0) {
				throw new Error('No settings given')
			}
			
			try {
				const updatedValues = await handler.run(
					req.fields,
					req._oauth.user.userId
				)
				
				req.apiResult(200, {
					updatedValues
				})
			} catch(error) {
				req.apiResult(500, {
					message: error
				})
			}
		}
	)
	
	return router
}