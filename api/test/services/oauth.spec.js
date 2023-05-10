import chai, { assert } from 'chai'
import chaiHttp from 'chai-http'
import express from 'express'
import cookieParser from 'cookie-parser'

import oauth from '../../src/services/auth/oauth.js'
import mockUser from '../util/mockUser.js'
import { MOCK_USER } from '../data.js'
import config from '../../config.js'

const server = express()

server.use(express.json())
server.use(cookieParser())
server.use(oauth.inject(server))
server.use('/oauth', oauth.use(server))

chai.use(chaiHttp)

describe('oauth', async () => {
	let account
	
	let userGrant
	let refreshToken
	let accessToken
	
	before(async () => {
		account = await mockUser.create()
		
		server.get(
			'/sensitive-data',
			server.oauth.authorize(),
			(req, res) => {
				res.sendStatus(200)
			}
		)
	})
	
	it('validates a client', async () => {
		const isClientValid = await oauth.validateClient(
			config.oauth_client_id,
			config.oauth_client_secret
		)
		
		assert.equal(isClientValid, true)
	})
	
	it('authenticates a user using ROPC grant', async () => {
		userGrant = await oauth.ROPCGrant(
			account.user.email,
			MOCK_USER.password
		)
		
		assert.exists(userGrant, 'grantId')
	})
	
	it('creates a refresh token', async () => {
		refreshToken = await oauth.issueRefreshToken(
			userGrant.grantId
		)
		
		assert.exists(refreshToken)
	})
	
	it('creates an access token', async () => {
		const res = await chai.request(server)
			.get('/oauth/token')
			.set('Cookie', `${config.shortName.refreshToken}=${refreshToken}`)
			.send()
		
		accessToken = res.body.access_token
		
		assert.exists(res.body, 'access_token')
	})
	
	it('authenticates a user using an access token', async () => {
		const request = await chai.request(server)
			.get('/sensitive-data')
			.auth(accessToken, { type: 'bearer' })
		
		assert.equal(request.status, 200)
	})
	
	it('failed an access token authentication', async () => {
		const request = await chai.request(server)
			.get('/sensitive-data')
			.auth('abc123', { type: 'bearer' })
			.send()
		
		assert.equal(request.status, 401)
	})
	
	it('verifies an access token', async () => {
		const tokenIsValid = await oauth.verifyAccessToken(
			oauth.decodeToken(accessToken)
		)
		
		assert.equal(tokenIsValid.success, true)
	})
	
	await mockUser.delete()
})