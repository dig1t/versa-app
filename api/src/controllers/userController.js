import {
	getUserFromUserId,
	getUserFromSession,
	authenticate,
	createAccount
} from '../services/userService.js'

export default {
	getUser: async (req) => {
		try {
			const user = await getUserFromSession(req.fields.sessionId)

			// Possible attack
			if (user.userId !== req.params.userId) throw new Error('UnexpectedError')

			req.apiResult(200, user)
		} catch(error) {
			req.apiResult(500)
		}
	},

	postAuthenticate: async (req) => {
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
		} catch(error) {
			req.apiResult(401, {
				message: error
			})
		}
	},

	postUserNew: async (req) => {
		try {
			const account = await createAccount(req)

			req.apiResult(200, account)
		} catch(error) {
			console.log(error)
			req.apiResult(500, {
				message: error
			})
		}
	}
}
