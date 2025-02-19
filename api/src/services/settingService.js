import Setting from '../models/Setting.js'

import { mongoSanitize } from '../util/mongoHelpers.js'

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

		try {
			const res = await Promise.allSettled(promises)

			return res.reduce((result, promise) => ({
				...result,
				...promise.value
			}), {})
		} catch(error) {
			console.log('error while changing settings')
			console.log(error)
		}
	}
}

export const deserializeSettings = (settings) => ({
	appTheme: shortcuts.appTheme[settings.appTheme || 0]
})

const getSettingsFromUserId = async (userId) => {
	const settings = await Setting.findOne({ _id: mongoSanitize(userId) })

	if (!settings) throw new Error('Could not get user settings')

	return deserializeSettings(settings)
}

export {
	getSettingsFromUserId,
	ActionHandler
}
