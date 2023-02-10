import chai, { assert } from 'chai'
import chaiHttp from 'chai-http'
import express from 'express'

import OAuth2 from '../../src/services/auth/oauth.js'
import mockUser from '../util/mockUser.js'
import { MOCK_USER } from '../data.js'
import config from '../../../config.js'

const server = express()

server.use(express.json())

chai.use(chaiHttp)

describe('oauth', async () => {
	let account
	let oauth
	
	let userGrant
	let refreshToken
	let accessToken
	
	before(async () => {
		account = await mockUser.create()
		oauth = await OAuth2()
		
		server.get('/sensitive-data', oauth.authorize(), (req, res) => {
			res.sendStatus(200)
		})
	})
	
	it('validates a client', async () => {
		const isClientValid = await oauth.validateClient(
			config.client_id,
			config.client_secret_original
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
		
		assert(refreshToken)
	})
	
	it('creates an access token', async () => {
		accessToken = await oauth.issueAccessToken(
			account.user.userId,
			refreshToken
		)
		
		assert(accessToken)
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
		const tokenIsValid = await oauth.verifyAccessToken(accessToken)
		
		assert.equal(tokenIsValid.success, true)
	})
	
	await mockUser.delete()
})