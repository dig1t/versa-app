import mongoose from 'mongoose'

import { validateText } from '../util'

import Post from '../models/Post'
import Content from '../models/Content'
import config from '../constants/config'

const POST_TYPES = {
	CONTENT: 1,
	COLLAB: 2
}

// const EMBED_TYPES = {
// 	CONTENT: 1
// }

const deserializeContent = content => ({
	contentId: content.contentId.toHexString(),
	userId: content.userId.toHexString(),
	body: content.body,
	created: content.created,
	private: content.private,
	
	media: content.media ? {
		mediaId: content.media.mediaId.toHexString(),
		userId: content.media.userId.toHexString(),
		source: content.media.source, // Direct URL
		created: content.media.created
	} : null
})

const deserializePost = (post, content) => ({
	postId: post.postId.toHexString(),
	userId: post.userId.toHexString(),
	created: post.created,
	
	content: deserializeContent(content)
})

const createContent = async data => {
	if (!data.userId) throw 'Missing userId'
	if (!data.body) throw 'Missing body'
	
	if (data.body.length > config.post.maxBodyLength || !validateText(data.body, 'text')) {
		throw `Content body is too long, max characters is ${config.post.maxBodyLength}`
	}
	
	const contentId = new mongoose.Types.ObjectId()
	const content = new Content({
		contentId,
		userId: data.userId,
		body: data.body
	})
	
	try {
		await content.save()
		
		return content
	} catch(e) {
		throw 'Could not create content'
	}
}

const createPost = async (userId, query) => {
	const { body } = query
	
	if (body.length > config.post.maxBodyLength || !validateText(body, 'text')) {
		throw `Content body is too long, max characters is ${config.post.maxBodyLength}`
	}
	
	const content = await createContent({
		userId,
		body: query.body
	})
	
	const postId = new mongoose.Types.ObjectId()
	const post = new Post({
		postId,
		contentId: content.contentId,
		userId
	})
	
	try {
		await post.save()
		
		return deserializePost(post, content)
	} catch(e) {
		throw 'Could not create post'
	}
}

const deletePost = async postId => {
	const post = await Post.findOne({ _id: sanitize(postId) })
	
	if (!post) throw 'Could not find post'
	
	try {
		if (post.type === POST_TYPES.CONTENT) {
			// User owns content of the post
			// Delete both the post and content
			
			//await Post.deleteMany({ contentId: post.contentId })
			await Content.deleteOne({ _id: post.contentId })
		} else {
			// Use was tagged as a collaborator or
			// reposted another user's content
			// Delete just the post
			await post.deleteOne({ _id: post.postId })
		}
	} catch(e) {
		throw 'Could not delete post'
	}
}

export {
	createPost,
	deletePost
}