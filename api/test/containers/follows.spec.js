import chai, { assert } from 'chai'
import chaiHttp from 'chai-http'

import server from '../../src/server.js'
import {
	getFollow,
	getFollowerList,
	getFollowingList,
	getFollowCount,
	getFollowingCount,
	isFollowing,
	isMutualFollower,
	createFollow,
	deleteFollow
} from '../../src/services/followService.js'
import mockUser from '../util/mockUser.js'

chai.config.includeStack = true

chai.use(chaiHttp)

describe('profile follows', async () => {
	let account
	let account2

	let follow

	before(async () => {
		account = await mockUser.create()
		account2 = await mockUser.create()
	})

	it('gets a users follower list', async () => {
		const request = await chai.request(server)
			.get('/v1/follow/list')
			.send({
				userId: account.user.userId
			})

		assert.equal(request.status, 200)
		assert.equal(request.body.success, true)

		assert.exists(request.body, 'data')
		assert.exists(request.body.data, 'followerList')
	})

	it('gets a users following list', async () => {
		const request = await chai.request(server)
			.get('/v1/follow/following_list')
			.send({
				userId: account.user.userId
			})

		assert.equal(request.status, 200)
		assert.equal(request.body.success, true)

		assert.exists(request.body, 'data')
		assert.exists(request.body.data, 'followingList')
	})

	it('expects no follow between 2 users', async () => {
		const res = await isMutualFollower(account.user.userId, account2.user.userId)

		assert.equal(res, false)
	})

	it('creates a follow', async () => {
		follow = await createFollow(account.user.userId, account2.user.userId)

		assert.equal(follow.following, true)
	})

	it('expects account2 to follow account1', async () => {
		const following = await isFollowing(account2.user.userId, account.user.userId)

		assert.equal(following, true)
	})

	it('gets a users follower list', async () => {
		const followers = await getFollowerList(account.user.userId, 1)

		assert.equal(followers.length, 1)
	})

	it('gets a users following list', async () => {
		const following = await getFollowingList(account2.user.userId, 1)

		assert.equal(following.length, 1)
	})

	it('finds a follow', async () => {
		const follow = await getFollow(account.user.userId, account2.user.userId)

		assert.exists(follow, 'followId')
	})

	it('does not allow duplicate follows', async () => {
		let res

		try {
			res = await createFollow(account.user.userId, account2.user.userId)
		} catch(error) {
			res = error
		}

		assert.typeOf(res, 'Error')
		assert.equal(res.message, 'User is already following the targeted user')
	})

	it('makes sure there is no mutual following', async () => {
		const res = await isMutualFollower(account.user.userId, account2.user.userId)

		assert.equal(res, false)
	})

	it('creates a mutual following', async () => {
		follow = await createFollow(account2.user.userId, account.user.userId)

		assert.exists(follow, 'followId')
	})

	it('makes sure there is a mutual following', async () => {
		const res = await isMutualFollower(account.user.userId, account2.user.userId)

		assert.equal(res, true)
	})

	it('expects a user\'s follower count to be 1', async () => {
		const followers = await getFollowCount(account.user.userId)

		assert.equal(followers, 1)
	})

	it('expects a user\'s following count to be 1', async () => {
		const followers = await getFollowingCount(account2.user.userId)

		assert.equal(followers, 1)
	})

	it('deletes a follow', async () => {
		const res = await deleteFollow(account.user.userId, account2.user.userId)

		assert.equal(res.following, false)
	})

	it('expects a user\'s follower count to be 0', async () => {
		const followers = await getFollowCount(account.user.userId)

		assert.equal(followers, 0)
	})
})
