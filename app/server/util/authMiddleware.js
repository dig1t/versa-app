// @version 1.0.0

import config from '../../../config.js'
import serverConfig from '../serverConfig.js'
import api from '../../src/util/api.js'

// User must have an authenticated session to continue
export const privateRoute = (req, res, next) => {
	if (typeof req._using?.auth === 'undefined') {
		throw new Error('authMiddleware: Middleware is required')
	} else if (typeof req._using?.api === 'undefined') {
		throw new Error('apiMiddleware: Middleware is required')
	}
	
	req.authenticated() ? next() : req.apiResult(401)
}

export const logout = async (req, res, next) => {
	if (typeof req._using?.auth === 'undefined') {
		throw new Error('authMiddleware: Middleware is required')
	}
	
	await req.logoutUser()
	
	next()
}

export default () => (req, res, next) => {
	if (!req._using) req._using = {}
	
	req._using.auth = '1.0.0'
	
	req.getAccessToken = async refreshToken => {
		if (!refreshToken) throw new Error('authMiddleware.getAccessToken(): Missing refresh token')
		
		const response = await api.get('/oauth/token', null, {
			headers: {
				cookie: `${config.shortName.refreshToken}=${refreshToken}`
			},
			customErrorHandler: true
		})
		
		return response.data.access_token
	}
	
	req.loginUser = data => new Promise((resolve, reject) => {
		if (!data) throw new Error('Missing user data')
		if (!data.refreshTokenId) throw new Error('Missing internal data')
		
		req.login(data, err => {
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
	
	req.authenticated = () => typeof req.user !== 'undefined'
	
	req.logoutUser = () => new Promise((resolve, reject) => {
		req.authenticated() ? req.logout(error => {
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