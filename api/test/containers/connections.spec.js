import { assert } from 'chai'
import {
	getFollower,
	getFollowers,
	getFollowCount,
	isConnection,
	createConnection,
	deleteConnection
} from '../../src/containers/connections.js'
import mockUser from '../util/mockUser.js'

describe('profile connections', async () => {
	let account
	let account2
	
	let connection
	
	before(async () => {
		account = await mockUser.create()
		account2 = await mockUser.create()
	})
	
	it('creates a connection', async () => {
		connection = await createConnection(account.user.userId, account2.user.userId)
		
		assert.exists(connection, 'followId')
	})
	
	it('deletes a connection', async () => {
		const res = await deleteConnection(connection.followId)
		
		assert.equal(res.deleted, true)
	})
	
	it('gets a user\'s follower count', async () => {
		const followers = await getFollowCount(account.user.userId)
		
		assert.equal(followers, 0)
	})
	
	await mockUser.delete()
})