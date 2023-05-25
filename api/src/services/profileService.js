import {
	deserializePost,
	profileFeedPipeline,
	getContent
} from './contentService.js'
import { ObjectIdToString, mongoSanitize, mongoValidate } from '../util/mongoHelpers.js'
import validateText from '../util/validateText.js'

import Post from '../models/Post.js'
import Profile from '../models/Profile.js'
import { isFollowing } from './followService.js'

const deserializeProfile = (profile) => ({
	userId: ObjectIdToString(profile.userId),
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
	if (!userId) throw new Error('Missing userId')
	
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
			(data) => data.userId === ObjectIdToString(post.userId)
		)
	}))
}

export {
	deserializeProfile,
	getProfileFromUserId,
	getProfileFromUsername,
	canViewProfile,
	isProfilePrivate,
	getProfilePosts
}