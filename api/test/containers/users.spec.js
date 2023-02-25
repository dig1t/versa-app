import chai, { assert } from 'chai'
import chaiHttp from 'chai-http'

import server from '../../src/server.js'
import {
	emailExists,
	getUserIdFromSession,
	getUserFromSession,
	getUserFromUserId,
} from '../../src/containers/users.js'
import mockUser from '../util/mockUser.js'
import { MOCK_USER } from '../data.js'

chai.config.includeStack = true

chai.use(chaiHttp)

describe('account functions', () => {
	let account
	
	it('creates an account (user and profile)', async () => {
		account = await mockUser.create()
	})
	
	it('gets user data from userId', async () => {
		const user = await getUserFromUserId(account.user.userId)
		
		assert(user)
	})
	
	it('authenticates a user using a password', async () => {
		const request = await chai.request(server)
			.post('/v1/user/authenticate')
			.send({
				email: account.user.email,
				password: MOCK_USER.password
			})
		
		assert.equal(request.status, 200)
		assert.equal(request.body.success, true)
		
		assert.exists(request.body, 'data')
		assert.exists(request.body.data, 'user')
		assert.exists(request.body.data, 'auth')
	})
	
	it('gets user from sessionId', async () => {
		const user = await getUserFromSession(account.auth.sessionId)
		
		assert(user.userId, account.user.userId)
	})
	
	it('checks if a user email exists', async () => {
		const res = await emailExists(account.user.email)
		
		assert.isTrue(res)
	})
	
	it('checks if a user email exists', async () => {
		const userId = await getUserIdFromSession(account.auth.sessionId)
		
		assert(userId, account.user.userId)
	})
	
	it('deletes an account', async () => await mockUser.delete(account.user.userId))
})