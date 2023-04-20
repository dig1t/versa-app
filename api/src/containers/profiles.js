import { Router } from 'express'

import {
	deserializePost,
	profileFeedPipeline,
	getContent
} from './content.js'
import { validateText, mongoSanitize, mongoValidate } from '../util/index.js'

import Post from '../models/Post.js'
import Profile from '../models/Profile.js'
import { isFollowing, getConnection } from './follows.js'

const deserializeProfile = (profile) => ({
	userId: profile.userId.toHexString(),
	username: profile.username,
	name: profile.name,
	verificationLevel: profile.verificationLevel || 0,
	avatar: profile.avatar,
	bannerPhoto: profile.bannerPhoto,
	bio: profile.bio || '',
	website: profile.website,
	lastActive: profile.lastActive,
	private: profile.private || false,
	followers: profile.followers || 0,
	following: profile.following || 0
})

const _getProfile = async (match) => {
	const profile = await Profile.findOne(match)
	
	if (!profile) throw new Error('Profile does not exist')
	
	return deserializeProfile(profile)
}

const getProfileFromUserId = async (userId) => {
	if (!mongoValidate(userId, 'id')) throw new Error('profiles.getProfileFromUserId(): Invalid type of id')
	
	return await _getProfile(
		{ _id: mongoSanitize(userId) }
	)
}

const getProfileFromUsername = async (username) => {
	if (!validateText(username, 'username')) throw new Error('profiles.getProfileFromUsername(): Invalid type of username')
	
	return await _getProfile(
		{ username: mongoSanitize(username) }
	)
}

const canViewProfile = async (userId, requesterUserId) => {
	const profile = await getProfileFromUserId(userId)
	
	if (!profile.private) return true
	
	// Profile is private and request is from an unauthenticated user
	if (typeof userId !== 'string') return false
	
	return isFollowing(userId, requesterUserId)
}

const isProfilePrivate = async (userId) => {
	const profile = await Profile.findOne({ _id: mongoSanitize(userId) })
		.select('private')
	
	if (!profile) throw new Error('Profile does not exist')
	
	// Model by default does not have this setting set
	return profile.private || false
}

const getProfilePosts = async (userId, requesterUserId) => {
	const profile = await getProfileFromUserId(userId)
	
	if (!profile) throw new Error('Could not find user')
	
	const posts = await Post.aggregate(
		await profileFeedPipeline({
			userId: profile.userId,
			requesterUserId
		})
	)
	
	if (!posts) throw new Error('Could not get profile feed')
	
	const profileCache = [ profile ]
	
	for (const post of posts) {
		try {
			const profileFind = profileCache.find(
				(data) => data.userId === post.userId
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
					(data) => data.userId === post.content.userId
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
	
	/*
	// Post
	{
		...post,
		content: {
			...contentData,
			profile
		},
	}*/
	return posts.map((post) => ({
		...deserializePost(post),
		profile: profileCache.find(
			(data) => data.userId === post.userId.toHexString()
		)
	}))
}

export {
	deserializeProfile,
	getProfileFromUserId,
	canViewProfile,
	isProfilePrivate,
	getProfilePosts
}

export default (server) => {
	const router = new Router()
	
	router.get(
		[
			'/profile/:userId?',
			'/profile/username/:username'
		],
		server.oauth.authorize({ optional: true }),
		async (req) => {
			try {
				if (!req.params.userId && !req.params.username) {
					throw new Error('Missing fields: userId or username')
				} else if (req.params.username && !validateText(req.params.username, 'username')) {
					throw new Error('Invalid username')
				}
				
				const profile = (
					req.params.userId && await getProfileFromUserId(req.params.userId)
				) || (
					req.params.username && await getProfileFromUsername(req.params.username)
				)
				
				if (!profile) throw new Error()
				
				const requesterUserId = req._oauth?.user?.userId
				
				if (requesterUserId) {
					profile.connection = await getConnection(profile.userId, requesterUserId)
				}
				
				req.apiResult(200, profile)
			} catch(error) {
				req.apiResult(500, {
					message: error || 'Could not get profile'
				})
			}
		}
	)
	
	router.get(
		'/profile/:userId/feed',
		server.oauth.authorize({ optional: true }),
		async (req) => {
			try {
				const userCanViewProfile = await canViewProfile(req.params.userId, req._oauth?.user?.userId)
				
				if (!userCanViewProfile) return req.apiResult(500, {
					message: 'Not authorized to view profile'
				})
				
				const posts = await getProfilePosts(req.params.userId, req._oauth?.user?.userId)
				
				req.apiResult(200, posts)
			} catch(error) {
				req.apiResult(500, {
					message: error
				})
			}
		}
	)
	
	return router
}