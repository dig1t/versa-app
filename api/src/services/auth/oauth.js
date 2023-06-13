import { Router } from 'express'
import crypto from 'crypto'
import bcrypt from 'bcrypt'
import { Buffer } from 'node:buffer'
import config from '../../../config.js'
import Adapter from './adapter.js'
import oauth2Config from '../../constants/oauth2Config.js'
import { authenticateUserCredentials, getUserFromUserId } from '../../services/userService.js'
import Logger from '../../util/logger.js'

class OAuth2 {
	constructor(credentials) {
		this._credentials = credentials || config.oauth2Credentials
		
		if (!this._credentials.client_id || !this._credentials.client_secret) {
			throw new Error('Missing OAuth2 Credentials, generate them with api/createClient.js')
		}
	}
	
	async getProvider() {
		if (this.provider) return this.provider
		
		const Provider = await new Promise((resolve) => {
			import('oidc-provider')
				.then((result) => resolve(result.default))
				.catch((error) => {
					console.error('Could not import oidc-provider')
					console.error(error)
				})
		})
		
		const issuer = `${config._apiDomain}:${config.apiPort}`
		
		this.provider = new Provider(issuer, {
			adapter: Adapter,
			...oauth2Config,
			clients: [
				{
					client_id: this._credentials.client_id,
					client_secret: this._credentials.client_secret,
					...oauth2Config.clients[0]
				}
			]
		})
		
		return this.provider
	}
	
	generateString(length) {
		return crypto.randomBytes(length || 16).toString('hex')
	}
	
	generateClientCredentials() {
		return {
			client_id: this.generateString(16),
			client_secret: this.generateString(32)
		}
	}
	
	async hashString(plainString) {
		try {
			const salt = await bcrypt.genSalt(8)
			return await bcrypt.hashSync(plainString, salt, null)
		} catch(error) {
			throw new Error(error)
		}
	}
	
	encodeToken(token) {
		if (!token) throw new Error('Missing Token')
		
		return Buffer.from(token, 'utf8').toString('base64')
	}
	
	decodeToken(base64Token) {
		if (!base64Token) throw new Error('Missing base64 Token')
		
		return Buffer.from(base64Token, 'base64').toString('utf8')
	}
	
	async validateString(plainString, hashedString) {
		return await bcrypt.compareSync(
			plainString,
			hashedString
		)
	}
	
	isExpired(timestamp) {
		const expiryDate = new Date(timestamp * 1000)
		
		return (expiryDate - new Date()) < 0
	}
	
	getAdapter(name) {
		return new Adapter(name)
	}
	
	generateMainAppCredentials() {
		const credentials = this.generateClientCredentials()
		
		this._credentials = credentials
		
		return credentials
	}
	
	async issueClientCredentials(predefinedCredentials) {
		const credentials = predefinedCredentials || this.generateClientCredentials()
		const provider = await this.getProvider()
		
		const client = await new provider.Client({
			client_id: credentials.client_id,
			client_secret: credentials.client_secret,
			redirect_uris: [`${config._apiDomain}:${config.apiPort}/auth/callback`],
			response_types: ['code'],
			grant_types: ['authorization_code'],
			token_endpoint_auth_method: 'client_secret_post',
		})
		
		try {
			await this.getAdapter('Client').upsert(client.clientId, client.metadata())
			
			return credentials
		} catch(error) {
			throw new Error(error)
		}
	}
	
	// ROPC Grant is ONLY for 1st party authentication
	async ROPCGrant(email, password) {
		try {
			const provider = await this.getProvider()
			const user = await authenticateUserCredentials(email, password)
			
			const grant = new provider.Grant({
				clientId: config.oauth2Credentials.client_id,
				accountId: user.userId
			})
			
			grant.addResourceScope('api', 'api:read api:write')
			
			await grant.save()
			
			grant.grantId = grant.jti
			
			return grant
		} catch(error) {
			console.log(error)
			throw new Error('Internal server error')
		}
	}
	
	async getClient(clientId) {
		const provider = await this.getProvider()
		const client = await provider.Client.find(clientId)
		
		if (!client) return
		
		return client
	}
	
	async getGrant(grantId) {
		const provider = await this.getProvider()
		const grant = await provider.Grant.find(grantId)
		
		if (!grant) return
		
		return grant
	}
	
	async getRefreshToken(refreshTokenId) {
		const provider = await this.getProvider()
		const refreshToken = await provider.RefreshToken.find(refreshTokenId)
		
		if (!refreshToken) return
		
		return refreshToken
	}
	
	async validateClient(clientId, clientSecret) {
		const client = await this.getClient(clientId)
		
		if (!client) return false
		
		return await this.validateString(
			clientSecret, // plain text secret to test
			client.clientSecret // hashed secret
		)
	}
	
	async issueRefreshToken(grantId) {
		const grant = await this.getGrant(grantId)
		
		if (!grant) throw new Error('Grant not found')
		if (this.isExpired(grant.exp)) throw new Error('Grant expired')
		
		const client = await this.getClient(grant.clientId)
		
		if (!client) throw new Error('Client not found')
		
		const provider = await this.getProvider()
		const refreshToken = new provider.RefreshToken({
			accountId: grant.accountId,
			grantId: grant.jti,
			client: client,
			scope: 'scope',
		})
		
		try {
			await refreshToken.save()
		} catch(error) {
			return
		}
		
		return refreshToken.jti
	}
	
	async issueAccessToken(refreshTokenId, clientId) {
		const provider = await this.getProvider()
		
		const client = await provider.Client.find(
			clientId || config.oauth2Credentials.client_id
		)
		
		const refreshToken = await this.getRefreshToken(refreshTokenId)
		
		if (!client || !refreshToken || this.isExpired(refreshToken.exp)) return
		
		const accessToken = new provider.AccessToken({
			accountId: refreshToken.accountId,
			refreshTokenId: refreshToken,
			client,
			scope: 'api api:read api:write'
		})
		
		try {
			await accessToken.save()
		} catch(error) {
			return
		}
		
		return accessToken.jti
	}
	
	async verifyAccessToken(accessToken) {
		try {
			const provider = await this.getProvider()
			const token = await provider.AccessToken.find(accessToken)
			
			if (!token || this.isExpired(token.exp)) throw new Error('Invalid token')
			
			const user = await getUserFromUserId(token.accountId)
			
			if (!user) throw new Error('No user found')
			
			return {
				success: true,
				user
			}
		} catch(error) {
			return {
				success: false
			}
		}
	}
	
	async getAPIAccessToken(refreshTokenId) {
		return await this.issueAccessToken(
			refreshTokenId, config.oauth2Credentials.client_id
		)
	}
	
	// Middlewares
	authorize(_options) {
		const options = _options || {}
		
		return async (req, res, next) => {
			const authorizationCode = req.headers?.authorization
			
			if (!authorizationCode) return options.optional === true ? next() : res.sendStatus(401)
			
			const accessToken = authorizationCode.split(' ')
			
			if (accessToken[0] !== 'Bearer') return res.sendStatus(400)
			
			const authVerification = await this.verifyAccessToken(
				this.decodeToken(accessToken[1])
			)
			
			if (authVerification.success) {
				req._oauth.user = authVerification.user
				
				next()
			} else {
				res.sendStatus(401)
			}
		}
	}
	
	useROPCGrant() {
		return async (req, res, next) => {
			if (!req.fields) return res.sendStatus(500)
			
			try {
				const grant = await this.ROPCGrant(
					req.fields.email,
					req.fields.password
				)
				
				req._oauth = { grant }
				
				next()
			} catch(error) {
				res.sendStatus(401)
			}
		}
	}
	
	inject(server) {
		server.oauth = this
		
		return (req, res, next) => {
			req.oauth = this
			req._oauth = {}
			
			next()
		}
	}
	
	useRoutes() {
		const router = new Router()
		
		router.get('/token', async (req, res) => {
			const refreshToken = req.cookies?.[config.shortName.refreshToken]
			if (!refreshToken) return res.sendStatus(401)
			
			try {
				const accessToken = await this.getAPIAccessToken(refreshToken)
				
				res.json({
					access_token: this.encodeToken(accessToken)
				})
			} catch(error) {
				Logger('OAuth2 /token', error.message)
				
				res.sendStatus(500)
			}
		})
		
		return router
	}
}

export default OAuth2