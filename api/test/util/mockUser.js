import chai, { assert } from 'chai'
import chaiHttp from 'chai-http'
import crypto from 'crypto'

import server from '../../src/server'
import {
	deleteAccount
} from '../../src/containers/users'
import { MOCK_USER } from '../data'

chai.config.includeStack = true

chai.use(chaiHttp)

let account

export default {
	create: async () => {
		const rand = await crypto.randomBytes(12).toString('hex')
		
		const res = await chai.request(server)
			.post('/v1/user/new')
			.send({
				data: {
					...MOCK_USER,
					email: `${rand}@bobmail.co` // Makes sure each test file gets a unique user
				}
			})
		
		assert.equal(res.status, 200)
		assert.equal(res.body.success, true)
		
		assert.exists(res.body, 'data')
		assert.exists(res.body.data, 'user')
		assert.exists(res.body.data, 'profile')
		assert.exists(res.body.data, 'sessionId')
		
		account = res.body.data
		
		return account
	},
	
	delete: async () => await deleteAccount(account.user.userId)
}