import chai, { assert } from 'chai'
import chaiHttp from 'chai-http'

import server from '../../src/server'
import {
	emailExists,
	getUserIdFromSession,
	getUserFromSession,
	getUserFromUserId,
	getProfileFromUserId,
} from '../../src/containers/users'
import mockUser from '../util/mockUser'
import { MOCK_USER } from '../data'

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
	
	it('gets user profile from userId', async () => {
		const profile = await getProfileFromUserId(account.user.userId)
		
		assert(profile)
	})
	
	it('authenticates a user using a password', async () => {
		const res = await chai.request(server)
			.post('/v1/user/authenticate')
			.send({
				data: {
					email: account.user.email,
					password: MOCK_USER.password
				}
			})
		
		assert.equal(res.status, 200)
		assert.equal(res.body.success, true)
		
		assert.exists(res.body, 'data')
		assert.exists(res.body.data, 'user')
		assert.exists(res.body.data, 'sessionId')
	})
	
	it('gets user from sessionId', async () => {
		const user = await getUserFromSession(account.sessionId)
		
		assert(user.userId, account.user.userId)
	})
	
	it('checks if a user email exists', async () => {
		const res = await emailExists(account.user.email)
		
		assert.isTrue(res)
	})
	
	it('checks if a user email exists', async () => {
		const userId = await getUserIdFromSession(account.sessionId)
		
		assert(userId, account.user.userId)
	})
	
	it('deletes an account', async () => await mockUser.delete())
})