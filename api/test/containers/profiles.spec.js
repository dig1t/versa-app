import chai, { assert } from 'chai'
import chaiHttp from 'chai-http'

import {
	getProfileFromUserId,
	canViewProfile,
	isProfilePrivate,
	getProfilePosts
} from '../../src/services/profileService.js'
import mockUser from '../util/mockUser.js'

chai.config.includeStack = true

chai.use(chaiHttp)

describe('profile functions', async () => {
	let account
	let account2

	it('creates an account (user and profile)', async () => {
		account = await mockUser.create()
		account2 = await mockUser.create()
	})

	it('gets profile from userId', async () => {
		const profile = await getProfileFromUserId(account.user.userId)

		assert(profile)
	})

	it('checks a user\'s privilege to view a public profile', async () => {
		const userCanViewProfile = await canViewProfile(account.user.userId, account2.user.userId)

		assert(userCanViewProfile, true)
	})

	it('checks a guest\'s privilege to view a public profile', async () => {
		const userCanViewProfile = await canViewProfile(account.user.userId)

		assert(userCanViewProfile, true)
	})

	it('checks the profile\'s private setting', async () => {
		const isPrivate = await isProfilePrivate(account.user.userId)

		assert.equal(isPrivate, false)
	})

	it('gets a profiles posts', async () => {
		const posts = await getProfilePosts(account.user.userId)

		assert.equal(posts.length, 0) // A new profile will not have posts
	})
})
