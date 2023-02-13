import config from '../../../config.js'

const maxTokenAge = 24 * 60 * 60 * 365

export default (req, res, next) => {
	req.loginUser = data => new Promise((resolve, reject) => {
		if (!data) throw 'Missing user data'
		if (!data.grantId) throw 'Missing internal data'
		if (!data.refreshTokenId) throw 'Missing internal data'
		
		req.login(data, err => {
			req.session.grantId = data.grantId
			req.session.save()
			
			// Set httpOnly RefreshToken cookie
			res.cookie(
				config.shortName.refreshToken,
				data.refreshTokenId,
				{
					maxAge: maxTokenAge,
					httpOnly: true,
					sameSite: 'strict'
				}
			)
			
			err ? reject(err) : resolve()
		})
	})
	
	next()
}