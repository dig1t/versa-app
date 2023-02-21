import { Router } from 'express'
import mongoose from 'mongoose'
import sanitize from 'mongo-sanitize'

import config from '../constants/config.js'
import { getUserFromUserId } from './users.js'
import {
	contentPipeline,
	deserializePost,
	profileFeedPipeline
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
	const user = await getProfileFromUserId(userId)
	
	if (!user) throw 'Could not find user'
	
	const posts = await Post.aggregate(
		await profileFeedPipeline({
			userId: user.userId,
			requesterUserId
		})
	)
	
	/*
		.match({
			userId: { $toObjectId: user.userId },
		})
		.sort({
			created: -1
		})
		.lookup({
			from: 'contents',
			localField: 'contentId',
			foreignField: '_id',
			pipeline: contentPipeline({ requesterUserId }),
			as: 'content'
		})
		.limit(10)
		.project({
			type: 0,
			__v: 0
		})
	*/
	
	if (!posts) throw 'Could not get profile feed'
	
	//return posts
	return posts.map(post => deserializePost(post))
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