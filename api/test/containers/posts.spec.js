import { createPost, deletePost } from '../../containers/posts'
import mockUser from '../util/mockUser'

describe('create post/content', async () => {
	const account = await mockUser.create()
	
	let post
	
	it('creates a post', async () => {
		post = await createPost(account.user.userId, {
			body: 'Hello World!'
		})
	})
	
	it('deletes a post', async () => {
		await deletePost(post.postId)
	})
	
	it('likes a post', async () => {
		
	})
	
	it('creates a user comment', async () => {
		
	})
	
	it('deletes a user comment', async () => {
		
	})
	
	await mockUser.delete()
})