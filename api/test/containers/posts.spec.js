import { assert } from 'chai'
import {
	getContent,
	getPost,
	createPost,
	deletePost
} from '../../src/containers/posts.js'
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
	
	it('gets a post\'s data', async () => {
		const postMetadata = await getPost(post.postId)
		
		assert.exists(postMetadata.postId)
	})
	
	it('gets content\'s data', async () => {
		const contentMetadata = await getContent(post.content?.contentId)
		
		assert.exists(contentMetadata.contentId)
	})
	
	it('deletes a post', async () => {
		await deletePost(post.postId)
	})
})