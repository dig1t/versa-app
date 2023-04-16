import { Router } from 'express'

import config from '../constants/config.js'
import { mongoSanitize, validateText } from '../util/index.js'
import useFields from '../util/useFields.js'
import Post from '../models/Post.js'
import { getProfileFromUserId } from './profiles.js'
import { deserializePost, getContent } from './content.js'

const homeFeedPipeline = async _options => {
	const options = {
		canViewContent: false,
		requesterUserId: '0',
		
		..._options
	}
	
	if (!options.userId) throw new Error('profileFeedPipeline: Missing userId')
	
	const profile = await getProfileFromUserId(options.userId)
	
	if (!profile) throw new Error('Could not find profile')
	
	return [
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

const getHomeFeed = async requesterUserId => {
	const posts = await Post.aggregate(
		await homeFeedPipeline({
			userId: requesterUserId
		})
	)
	
	const profile = await getProfileFromUserId(requesterUserId)
	
	if (!profile) throw new Error('Could not find profile')
	if (!posts) throw new Error('Could not get profile feed')
	
	const profileCache = [ profile ]
	
	for (const post of posts) {
		try {
			const profileFind = profileCache.find(
				data => data.userId === post.userId
			)
			
			post.content = await getContent(post.contentId, requesterUserId)
			
			if (!profileFind) {
				profileCache.push(
					// If the content's owner is the same as the poster,
					// use the content profile, else fetch the poster's profile
					post.content.userId === post.userId ? post.content.profile : await getProfileFromUserId(post.userId)
				)
			}
			
			if (post.content.userId !== post.userId) {
				const contentProfileFind = profileCache.find(
					data => data.userId === post.content.userId
				)
				
				if (!contentProfileFind) profileCache.push(post.content.profile)
			}
		} catch(error) {
			// Error fetching content
			// TODO: post blank object??
			console.log('fetch content err', error)
			post.content = {}
		}
	}
	
	/*/
	// Post
	{
		...post,
		content: {
			...contentData,
			profile
		},
	}*/
	return posts.map(post => ({
		...deserializePost(post),
		profile: profileCache.find(
			data => data.userId === post.userId.toHexString()
		)
	}))
}

export default server => {
	const router = new Router()
	
	router.get(
		'/feed/home',
		server.oauth.authorize(),
		async (req) => {
			try {
				const feed = await getHomeFeed(req._oauth.user.userId)
				
				req.apiResult(200, feed)
			} catch(error) {
				req.apiResult(500, {
					message: error
				})
			}
		}
	)
	
	return router
}