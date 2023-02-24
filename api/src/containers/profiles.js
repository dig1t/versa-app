import { Router } from 'express'
import sanitize from 'mongo-sanitize'

import {
	deserializePost,
	profileFeedPipeline,
	getContent
} from './posts.js'
import { validateText } from '../util/index.js'
import useFields from '../util/useFields.js'

import Post from '../models/Post.js'
import Profile from '../models/Profile.js'

const deserializeProfile = profile => ({
	userId: profile.userId.toHexString(),
	username: profile.username,
	name: profile.name,
	verificationLevel: profile.verificationLevel,
	avatar: profile.avatar,
	bannerPhoto: profile.bannerPhoto,
	bio: profile.bio,
	website: profile.website,
	lastActive: profile.lastActive
})

const _getProfile = async match => {
	const profile = await Profile.findOne(match)
	
	if (!profile) throw 'Profile does not exist'
	
	return deserializeProfile(profile)
}

const getProfileFromUserId = async userId => await _getProfile({
	_id: sanitize(userId)
})

const getProfileFromUsername = async username => await _getProfile({
	username: sanitize(username)
})

const getProfilePosts = async (userId, requesterUserId) => {
	const profile = await getProfileFromUserId(userId)
	
	if (!profile) throw 'Could not find user'
	
	const posts = await Post.aggregate(
		await profileFeedPipeline({
			userId: profile.userId,
			requesterUserId
		})
	)
	
	if (!posts) throw 'Could not get profile feed'
	
	const profileCache = [ profile ]
	
	for (const post of posts) {
		try {
			const profileFind = profileCache.find(
				data => data.userId === post.userId
			)
			
			post.content = await getContent(post.contentId)
			
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
		} catch(e) {
			// Error fetching content
			// TODO: post blank object??
			console.log('fetch content err', e)
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

export {
	deserializeProfile,
	getProfileFromUserId,
	getProfilePosts
}

export default server => {
	const router = new Router()
	
	router.get(
		'/profile',
		useFields(),
		async req => {
			try {
				if (!req.fields.userId && !req.fields.username) {
					throw 'Missing fields: userId or username'
				} else if (req.fields.username && !validateText(req.fields.username, 'username')) {
					throw new Error()
				}
				
				const profile = (
					req.fields.userId && await getProfileFromUserId(req.fields.userId)
				) || (
					req.fields.username && await getProfileFromUsername(req.fields.username)
				)
				
				req.apiResult(200, profile)
			} catch(err) {
				req.apiResult(500, {
					message: err
				})
			}
		}
	)
	
	router.get(
		'/profile/feed',
		useFields({ fields: ['userId'] }),
		async req => {
			try {
				const posts = await getProfilePosts(req.fields.userId)
				
				req.apiResult(200, posts)
			} catch(err) {
				req.apiResult(500, {
					message: err
				})
			}
		}
	)
	
	return router
}