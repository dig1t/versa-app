import { updateEmail, updatePassword, updateProfile, updateUsername } from '../services/userService.js'
import { getSettingsFromUserId, ActionHandler } from '../services/settingService.js'

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

export default {
	getSettings: async (req) => {
		try {
			if (req._oauth.user.userId !== req.params.userId) {
				throw new Error('Unexpected Error')
			}

			const settings = await getSettingsFromUserId(req._oauth.user.userId)

			req.apiResult(200, settings)
		} catch(error) {
			req.apiResult(500, {
				message: error
			})
		}
	},

	updateSettings: async (req) => {
		try {
			if (req._oauth.user.userId !== req.params.userId) {
				throw new Error('Unexpected Error')
			}

			if (Object.keys(req.fields).length === 0) {
				throw new Error('No settings given')
			}

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
}
