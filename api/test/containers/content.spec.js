import { assert } from 'chai'
import {
	getContent,
	getPost,
	createPost,
	deletePost,
	createComment,
	deleteComment,
	getComments,
	createLike,
	deleteLike,
	userLikesContent
} from '../../src/containers/content.js'
import mockUser from '../util/mockUser.js'

describe('create post and content', async () => {
	let account
	let post
	let comment
	let like
	
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
	
	it('adds a comment', async () => {
		comment = await createComment({
			userId: account.user.userId,
			contentId: post.content.contentId,
			body: 'hello world!'
		})
		
		assert.exists(comment, 'commentId')
	})
	
	it('gets all comments', async () => {
		const comments = await getComments(post.content.contentId)
		
		assert.equal(comments.length, 1)
	})
	
	it('deletes a comment', async () => {
		const res = await deleteComment(comment.commentId)
		
		assert.equal(res.deleted, true)
	})
	
	it('adds a like', async () => {
		like = await createLike({
			userId: account.user.userId,
			contentId: post.content.contentId
		})
		
		assert.exists(like, 'likeId')
	})
	
	it('checks if user likes the content', async () => {
		const result = await userLikesContent({
			userId: account.user.userId,
			contentId: post.content.contentId
		})
		
		assert.equal(result, true)
	})
	
	it('deletes a likes', async () => {
		const res = await deleteLike({
			userId: account.user.userId,
			contentId: post.content.contentId
		})
		
		assert.equal(res.deleted, true)
	})
	
	it('deletes a post', async () => {
		await deletePost(post.postId)
	})
})