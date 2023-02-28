import { Router } from 'express'
import mongoose from 'mongoose'

import config from '../constants/config.js'
import { validateText, mongoSanitize } from '../util/index.js'
import useFields from '../util/useFields.js'

import Post from '../models/Post.js'
import Content from '../models/Content.js'
import { getProfileFromUserId } from './profiles.js'
import { isConnection } from './connections.js'

const POST_TYPES = {
	CONTENT: 1,
	COLLAB: 2
}

// const EMBED_TYPES = {
// 	CONTENT: 1
// }

const deserializeContent = (content, profile) => ({
	contentId: content._id.toHexString(),
	userId: content.userId.toHexString(),
	body: content.body,
	created: content.created,
	private: content.private,
	
	media: typeof content.media === 'object' && content.media[0] ? {
		mediaId: content.media[0]._id.toHexString(),
		userId: content.media[0].userId.toHexString(),
		source: content.media[0].source, // Direct URL
		created: content.media[0].created
	} : undefined,
	
	profile
})

const deserializePost = (post, content, profile) => ({
	postId: post._id.toHexString(),
	userId: post.userId.toHexString(),
	created: post.created,
	
	profile: profile || post.profile,
	
	content: content || post.content
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
		
		return deserializeContent(content)
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
		
		return deserializePost(
			post,
			content,
			await getProfileFromUserId(userId)
		)
	} catch(e) {
		throw `posts.createPost() - ${e}` || 'Could not create post'
	}
}

const deletePost = async postId => {
	const post = await Post.findOne({ _id: mongoSanitize(postId) })
	
	if (!post) throw 'Could not find post'
	
	try {
		if (post.type === POST_TYPES.CONTENT) {
			// User owns content of the post
			// Delete both the post and content
			
			//await Post.deleteMany({ contentId: post.contentId })
			await Content.deleteOne({ _id: post.contentId })
			
			return { deleted: true }
		} else {
			// Use was tagged as a collaborator or
			// reposted another user's content
			// Delete just the post
			await post.deleteOne({ _id: post.postId })
			
			return { deleted: true }
		}
	} catch(e) {
		throw 'Could not delete post'
	}
}

const getContent = async (contentId, requesterUserId) => {
	const content = await Content.findOne({ _id: contentId })
	
	if (!content) throw 'Content not found'
	
	const profile = await getProfileFromUserId(content.userId)
	
	const canViewContent = profile.private ? (
		typeof requesterUserId === 'undefined' ? await isConnection(content.userId, requesterUserId) : false
	) : true
	
	if (!canViewContent) throw 'Cannot view private content'
	
	return deserializeContent(content, profile)
}

const contentPipeline = async _options => {
	const options = {
		..._options
	}
	
	const pipeline = []
	
	if (options.contentId) pipeline.push({
		'$match': {
			_id: { $toObjectId: options.contentId }
		}
	})
	
	pipeline.push(
		{ $match: {
			private: { $ne: true }
		} },
		{ $addFields: { contentId: '$_id' } },
		{ $project: {
			contentId: 1,
			userId: 1,
			body: 1,
			created: 1,
			private: 1
		} }
	)
	
	return pipeline
}

const profileFeedPipeline = async _options => {
	const options = {
		canViewContent: false,
		requesterUserId: '0',
		
		..._options
	}
	
	if (!options.userId) throw 'profileFeedPipeline: Missing userId'
	
	const profile = await getProfileFromUserId(options.userId)
	
	if (!profile) throw 'Could not find profile'
	
	const canViewFeed = !profile.private || isConnection(
		profile.userId, options.requesterUserId
	)
	
	if (!canViewFeed) return {} // No posts to show
	
	return [
		{ $match: {
			$expr: {
				$eq: [
					'$userId',
					{ $toObjectId: options.userId }
				]
			}
		} },
		{ $sort: {
			created: -1
		} },
		{ $limit: config.profile.maxFeedPagePosts },
		{ $addFields: {
			postId: '$_id'
		} },
		{ $project: {
			type: 0,
			__v: 0
		} }
	]
}

const getPost = async (postId, requesterUserId) => {
	const post = await Post.findOne({ postId })
	
	if (!post) throw 'Post not found'
	
	// Private content can only be viewed by the content creator
	const content = await getContent(post.contentId)
	
	if (content.private && requesterUserId !== contentOwner.userId) throw 'Post is private'
	
	const posterProfile = await getProfileFromUserId(post.userId)
	
	if (posterProfile.private) {
		// TODO: REPLACE WITH CONNECTION CHECK
		// profile.isConnection(userId, requesterUserId)
		const canViewPosts = await isConnection(post.userId, requesterUserId)
		
		if (!canViewPosts) throw 'Not friends with poster'
	}
	
	const contentOwner = (
		content.userId === posterProfile.userId
	) ? posterProfile : await getProfileFromUserId(content.userId)
	
	if (posterProfile.userId !== contentOwner.userId && contentOwner.private) {
		// TODO: REPLACE WITH CONNECTION CHECK
		// profile.isConnection(userId, requesterUserId)
		const canViewContent = await isConnection(content.userId, requesterUserId)
		
		if (!canViewContent) throw 'Not friends with content owner'
	}
	
	return post
}

export {
	contentPipeline,
	profileFeedPipeline,
	deserializePost,
	getContent,
	createPost,
	deletePost
}

export default server => {
	const router = new Router()
	
	router.post(
		'/post/new',
		useFields({ fields: ['body'] }),
		server.oauth.authorize(),
		async req => {
			try {
				const post = await createPost(req._oauth.user.userId, req.fields)
				
				req.apiResult(200, post)
			} catch(err) {
				req.apiResult(500, {
					message: err
				})
			}
		}
	)
	
	router.post(
		'/post',
		useFields({ fields: ['postId']}),
		server.oauth.authorize({ optional: true }),
		async req => {
			try {
				const post = await getPost(req.fields.postId)
				
				if (!post) throw 'Post not found'
				
				
				
				req.apiResult(200, post)
			} catch(err) {
				req.apiResult(500, {
					message: err
				})
			}
		}
	)
	
	/*
	router.post('/post/like', (req, res) => {
		
	})
	*/
	
	return router
}