import chai, { assert } from 'chai'
import chaiHttp from 'chai-http'

import {
	getProfileFromUserId
} from '../../src/containers/profiles.js'
import mockUser from '../util/mockUser.js'

chai.config.includeStack = true

chai.use(chaiHttp)

describe('account functions', () => {
	let account
	
	it('creates an account (user and profile)', async () => {
		account = await mockUser.create()
	})
	
	it('gets profile from userId', async () => {
		const profile = await getProfileFromUserId(account.user.userId)
		
		assert(profile)
	})
})