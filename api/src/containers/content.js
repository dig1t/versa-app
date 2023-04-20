import { Router } from 'express'
import mongoose from 'mongoose'

import config from '../constants/config.js'
import { validateText, mongoSanitize, mongoSession } from '../util/index.js'
import useFields from '../util/useFields.js'

import Post from '../models/Post.js'
import Content from '../models/Content.js'
import { canViewProfile, getProfileFromUserId } from './profiles.js'
import { isMutualFollower } from './follows.js'
import Comment from '../models/Comment.js'
import Like from '../models/Like.js'

const POST_TYPES = {
	CONTENT: 1,
	COLLAB: 2
}

// const EMBED_TYPES = {
// 	CONTENT: 1
// }

const deserializeContent = (content, profile) => ({
	contentId: content.contentId || content._id.toHexString(),
	userId: content.userId.toHexString(),
	body: content.body,
	created: content.created,
	private: content.private,
	
	liked: content.liked,
	
	likes: content.likes,
	comments: content.comments,
	reposts: content.reposts,
	
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

const deserializeComment = (comment) => ({
	commentId: comment._id.toHexString(),
	contentId: comment.contentId.toHexString(),
	userId: comment.userId.toHexString(),
	body: comment.body,
	created: comment.created
})

const deserializeLike = (like) => ({
	likeId: like._id.toHexString(),
	contentId: like.contentId.toHexString(),
	userId: like.userId.toHexString()
})

const createContent = async (data) => {
	if (!data.userId) throw new Error('Missing userId')
	if (!data.body) throw new Error('Missing body')
	
	if (data.body.length > config.post.maxBodyLength || !validateText(data.body, 'text')) {
		throw new Error(`Content body is too long, max characters is ${config.post.maxBodyLength}`)
	}
	
	const contentId = new mongoose.Types.ObjectId()
	const content = new Content({
		contentId,
		userId: data.userId,
		body: data.body
	})
	
	try {
		await content.save()
		
		return deserializeContent(content, data.profile)
	} catch(error) {
		throw new Error('Could not create content')
	}
}

const createPost = async (userId, query) => {
	const { body } = query
	
	if (body.length > config.post.maxBodyLength || !validateText(body, 'text')) {
		throw new Error(`Content body is too long, max characters is ${config.post.maxBodyLength}`)
	}
	
	try {
		const profile = await getProfileFromUserId(userId)
		
		return await mongoSession(async () => {
			const content = await createContent({
				userId,
				body: query.body,
				profile
			}, profile)
			
			const postId = new mongoose.Types.ObjectId()
			const post = new Post({
				postId,
				contentId: content.contentId,
				userId
			})
			
			await post.save()
			
			return deserializePost(
				post,
				content,
				profile
			)
		})
	} catch(error) {
		throw new Error(`posts.createPost() - ${error}` || 'Could not create post')
	}
}

const deletePost = async (postId) => {
	const post = await Post.findOne({ _id: mongoSanitize(postId) })
	
	if (!post) throw new Error('Could not find post')
	
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
	} catch(error) {
		throw new Error('Could not delete post')
	}
}

const getContent = async (contentId, requesterUserId) => {
	const content = await Content.findOne({ _id: contentId })
	
	if (!content) throw new Error('Content not found')
	
	const profile = await getProfileFromUserId(content.userId)
	
	const canViewContent = profile.private ? (
		typeof requesterUserId === 'undefined' ? await isMutualFollower(content.userId, requesterUserId) : false
	) : true
	
	if (!canViewContent) throw new Error('Cannot view private content')
	
	if (requesterUserId) {
		content.liked = await userLikesContent({
			userId: requesterUserId,
			contentId
		})
	}
	
	return deserializeContent(content, profile)
}

const contentPipeline = async (_options) => {
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

const profileFeedPipeline = async (_options) => {
	const options = {
		canViewContent: false,
		requesterUserId: '0',
		
		..._options
	}
	
	if (!options.userId) throw new Error('profileFeedPipeline: Missing userId')
	
	const profile = await getProfileFromUserId(options.userId)
	
	if (!profile) throw new Error('Could not find profile')
	
	const canViewFeed = !profile.private
		|| profile.userId === options.requesterUserId
		|| isMutualFollower(profile.userId, options.requesterUserId)
	
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
	const post = await Post.findOne({ _id: mongoSanitize(postId) })
		.select('contentId userId created type')
	
	if (!post) throw new Error('Post not found')
	
	// Private content can only be viewed by the content creator
	const content = await getContent(post.contentId, requesterUserId)
	
	if (content.private && requesterUserId !== content.userId) throw new Error('Post is private')
	
	const posterProfile = await getProfileFromUserId(post.userId)
	
	if (posterProfile.private) {
		const userCanViewProfile = await canViewProfile(post.userId, requesterUserId)
		
		if (!userCanViewProfile) throw new Error('Not friends with poster')
	}
	
	const contentOwner = (
		content.userId === posterProfile.userId
	) ? posterProfile : await getProfileFromUserId(content.userId)
	
	if (posterProfile.userId !== contentOwner.userId && contentOwner.private) {
		const userCanViewProfile = await canViewProfile(content.userId, requesterUserId)
		
		if (!userCanViewProfile) throw new Error('Not friends with content owner')
	}
	
	return deserializePost(
		post,
		content,
		posterProfile
	)
}

const createComment = async (data) => {
	if (!data.userId) throw new Error('Missing userId')
	if (!data.contentId) throw new Error('Missing contentId')
	if (!data.body) throw new Error('Missing body')
	
	if (data.body.length > config.post.maxBodyLength || !validateText(data.body, 'text')) {
		throw new Error(`Comment body is too long, max characters is ${config.post.maxBodyLength}`)
	}
	
	const content = await getContent(data.contentId)
	
	if (content.hidden) throw new Error('Could not create comment')
	
	const commentId = new mongoose.Types.ObjectId()
	const comment = new Comment({
		commentId,
		contentId: data.contentId,
		userId: data.userId,
		body: data.body
	})
	
	try {
		await mongoSession(async () => {
			await comment.save()
			await Content.updateOne(
				{ _id: mongoSanitize(data.contentId) },
				{ $inc: { 'comments': 1 } }
			)
		})
		
		return deserializeComment(comment)
	} catch(error) {
		throw new Error('Could not create comment')
	}
}

const deleteComment = async (commentId) => {
	const comment = await Comment.findOne({ _id: mongoSanitize(commentId) })
	
	if (!comment) throw new Error('Could not find comment')
	
	try {
		await mongoSession(async () => {
			await Comment.deleteOne({ _id: comment.commentId })
			await Content.updateOne(
				{ _id: mongoSanitize(comment.contentId) },
				{ $inc: { 'comments': -1 } }
			)
		})
		
		return { deleted: true }
	} catch(error) {
		throw new Error('Could not delete post')
	}
}

const getComments = async (contentId, requesterUserId) => {
	const content = await getContent(contentId, requesterUserId)
	
	if (content.hidden) throw new Error('Could not create comment')
	
	try {
		const comments = await Comment.find({ contentId: mongoSanitize(contentId)} )
			.sort({ created: -1 })
			.limit(10)
		
		return comments.map((comment) => deserializeComment(comment))
	} catch(error) {
		throw new Error('Could not get comments')
	}
}

const createLike = async (data) => {
	if (!data.userId) throw new Error('Missing userId')
	if (!data.contentId) throw new Error('Missing contentId')
	
	if (await getUserLike(data)) throw new Error('User already liked the content')
	
	const content = await getContent(data.contentId)
	
	if (content.hidden) throw new Error('Could not create like')
	
	const likeId = new mongoose.Types.ObjectId()
	const like = new Like({
		likeId,
		contentId: data.contentId,
		userId: data.userId
	})
	
	try {
		await mongoSession(async () => {
			await like.save()
			await Content.updateOne(
				{ _id: mongoSanitize(data.contentId) },
				{ $inc: { 'likes': 1 } }
			)
		})
		
		return deserializeLike(like)
	} catch(error) {
		throw new Error('Could not create like')
	}
}

const deleteLike = async (data) => {
	if (!data.userId) throw new Error('Missing userId')
	if (!data.contentId) throw new Error('Missing contentId')
	
	const like = await getUserLike(data)
	
	try {
		await mongoSession(async () => {
			await Like.deleteOne({ _id: mongoSanitize(like.likeId) })
			await Content.updateOne(
				{ _id: mongoSanitize(like.contentId) },
				{ $inc: { 'likes': -1 } }
			)
		})
		
		return { deleted: true }
	} catch(error) {
		throw new Error('Could not delete like')
	}
}

const getUserLike = async (data) => {
	if (!data.userId) throw new Error('Missing userId')
	if (!data.contentId) throw new Error('Missing contentId')
	
	const like = await Like.findOne({
		userId: mongoSanitize(data.userId),
		contentId: mongoSanitize(data.contentId)
	})
	
	return like ? deserializeLike(like) : null
}

const userLikesContent = async (data) => {
	if (!data.userId) throw new Error('Missing userId')
	if (!data.contentId) throw new Error('Missing contentId')
	
	const like = await getUserLike(data)
	
	return like && typeof like.likeId !== 'undefined'
}

export {
	contentPipeline,
	profileFeedPipeline,
	deserializePost,
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
}

export default (server) => {
	const router = new Router()
	
	router.get(
		'/content/:contentId',
		server.oauth.authorize({ optional: true }),
		async (req) => {
			try {
				const content = await getContent(req.params.contentId, req._oauth?.user?.userId)
				
				if (!content) throw new Error('Content not found')
				
				req.apiResult(200, content)
			} catch(error) {
				req.apiResult(500, {
					message: error
				})
			}
		}
	)
	
	router.post(
		'/content/:contentId/comment',
		useFields({ fields: ['body'] }),
		server.oauth.authorize(),
		async (req) => {
			try {
				const post = await createComment({
					userId: req._oauth.user.userId,
					contentId: req.params.contentId,
					body: req.fields.body
				})
				
				req.apiResult(200, post)
			} catch(error) {
				req.apiResult(500, {
					message: error
				})
			}
		}
	)
	
	router.delete(
		'/content/:contentId/comment',
		server.oauth.authorize(),
		async (req) => {
			try {
				const res = await deleteComment({
					userId: req._oauth.user.userId,
					contentId: req.params.contentId
				})
				
				req.apiResult(200, res)
			} catch(error) {
				req.apiResult(500, {
					message: error
				})
			}
		}
	)
	
	router.post(
		'/content/:contentId/like',
		server.oauth.authorize(),
		async (req) => {
			try {
				const like = await createLike({
					userId: req._oauth.user.userId,
					contentId: req.params.contentId
				})
				
				req.apiResult(200, like)
			} catch(error) {
				req.apiResult(500, {
					message: error
				})
			}
		}
	)
	
	router.delete(
		'/content/:contentId/like',
		server.oauth.authorize(),
		async (req) => {
			try {
				const res = await deleteLike({
					userId: req._oauth.user.userId,
					contentId: req.params.contentId
				})
				
				req.apiResult(200, res)
			} catch(error) {
				req.apiResult(500, {
					message: error
				})
			}
		}
	)
	
	router.get(
		'/content/:contentId/comments',
		server.oauth.authorize({ optional: true }),
		async (req) => {
			try {
				const comments = await getComments(req.params.contentId, req._oauth?.user?.userId)
				
				if (!comments) throw new Error('Comments not found')
				
				req.apiResult(200, comments)
			} catch(error) {
				req.apiResult(500, {
					message: error
				})
			}
		}
	)
	
	router.post(
		'/post/new',
		useFields({ fields: ['body'] }),
		server.oauth.authorize(),
		async (req) => {
			try {
				const post = await createPost(req._oauth.user.userId, req.fields)
				
				req.apiResult(200, post)
			} catch(error) {
				req.apiResult(500, {
					message: error
				})
			}
		}
	)
	
	router.get(
		'/post/:postId',
		server.oauth.authorize({ optional: true }),
		async (req) => {
			try {
				const post = await getPost(req.params.postId, req._oauth.user.userId)
				
				if (!post) throw new Error('Post not found')
				
				req.apiResult(200, post)
			} catch(error) {
				req.apiResult(500, {
					message: error
				})
			}
		}
	)
	
	/*
	router.post('/content/:contentId/like', (req, res) => {
		
	})
	*/
	
	return router
}