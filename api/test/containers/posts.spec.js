import { createPost, deletePost } from '../../src/containers/posts.js'
import mockUser from '../util/mockUser.js'

describe('create post and content', async () => {
	let account
	let post
	
	before(async () => {
		account = await mockUser.create()
	})
	
	it('creates a post', async () => {
		post = await createPost(account.user.userId, {
			body: 'Hello World!'
		})
	})
	
	it('deletes a post', async () => {
		await deletePost(post.postId)
	})
	
	await mockUser.delete()
})