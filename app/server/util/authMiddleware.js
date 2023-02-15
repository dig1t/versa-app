import config from '../../../config.js'
import serverConfig from '../serverConfig.js'

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
					maxAge: serverConfig.maxTokenAge,
					httpOnly: true,
					sameSite: 'strict'
				}
			)
			
			err ? reject(err) : resolve()
		})
	})
	
	req.logout = () => new Promise((resolve, reject) => {
		req.isAuthenticated() ? req.logout(error => {
			if (error) return reject(error)
			
			req.loggedUserOut = true
			
			res.clearCookie(config.shortName.session)
			res.clearCookie(config.shortName.refreshToken)
			
			req.session.destroy()
			
			resolve()
		}) : resolve()
	})
	
	next()
}