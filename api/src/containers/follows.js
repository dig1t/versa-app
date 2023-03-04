import { Router } from 'express'
import mongoose from 'mongoose'

import useFields from '../util/useFields.js'
import { mongoValidate, mongoSanitize, mongoSession } from '../util/index.js'

import Follower from '../models/Follower.js'
import Profile from '../models/Profile.js'
import { canViewProfile, getProfileFromUserId } from './profiles.js'

const deserializeFollow = follow => ({
	followId: follow._id.toHexString(),
	userId: follow.userId.toHexString(),
	followerUserId: follow.followerUserId.toHexString(),
	requested: follow.requested,
	created: follow.created
})

const getFollow = async (userId, followerUserId, ignoreFollowRequest) => {
	if (typeof userId === 'undefined') throw new Error('Missing userId')
	if (typeof followerUserId === 'undefined') throw new Error('Missing followerUserId')
	
	if (userId === followerUserId) throw new Error('Cannot get follow from the same userId')
	
	try {
		const follow = await Follower.findOne({
			userId: mongoSanitize(userId),
			followerUserId: mongoSanitize(followerUserId),
			requested: ignoreFollowRequest === true ? undefined : { $ne: true }
		})
		
		return follow ? deserializeFollow(follow) : undefined
	} catch(error) {
		throw new Error(error)
	}
}

const getFollowerList = async (userId, page) => {
	// TODO: Filter by page
	const followers = await Follower.find({ userId: mongoSanitize(userId) })
	
	if (!followers) throw new Error('Could not get follower list')
	
	const res = []
	
	for (let followerIndex in followers) {
		const follow = followers[followerIndex]
		const profile = await getProfileFromUserId(follow.followerUserId)
		
		res.push(profile)
	}
	
	return res
}

const getFollowingList = async (userId, page) => {
	// TODO: Filter by page
	const following = await Follower.find({ followerUserId: mongoSanitize(userId) })
	
	if (!following) throw new Error('Could not get following list')
	
	const res = []
	
	for (let followerIndex in following) {
		const follow = following[followerIndex]
		const profile = await getProfileFromUserId(follow.userId)
		
		res.push(profile)
	}
	
	return res
}

const isFollowing = async (userId, followerUserId) => {
	if (typeof followerUserId === 'undefined') return false
	
	if (userId === followerUserId) return false
	
	try {
		const follows = await getFollow(followerUserId, userId)
		
		if (!follows || follows.requested) return false
		
		return typeof follows.followId !== 'undefined'
	} catch(error) {
		console.log(error)
		
		return false
	}
}

const isMutualFollower = async (userId, followerUserId) => {
	if (typeof followerUserId === 'undefined') return false
	
	if (userId === followerUserId) return true
	
	try {
		const follows = await isFollowing(followerUserId, userId)
		
		if (!follows) return false
		
		const followsBack = await isFollowing(userId, followerUserId)
		
		return followsBack
	} catch(error) {
		console.log(error)
		
		return false
	}
}

const getFollowCount = async userId => {
	const profile = await Profile.findOne({ _id: mongoSanitize(userId) })
		.select('followers')
	
	if (!profile || typeof profile.followers !== 'number') throw new Error('Profile does not exist')
	
	return profile.followers
}

const getFollowingCount = async userId => {
	const profile = await Profile.findOne({ _id: mongoSanitize(userId) })
		.select('following')
	
	if (!profile || typeof profile.following !== 'number') throw new Error('Profile does not exist')
	
	return profile.following
}

const createFollow = async (userId, followerUserId) => {
	if (!userId) throw new Error('Missing userId')
	if (!followerUserId) throw new Error('Missing followerUserId')
	
	if (!mongoValidate(userId, 'id') || !mongoValidate(followerUserId, 'id')) {
		throw new Error(`Invalid userId`)
	}
	
	const isFollowing = await getFollow(userId, followerUserId, true)
	
	if (isFollowing) throw new Error('User is already following the targeted user')
	
	const followId = new mongoose.Types.ObjectId()
	const follow = new Follower({
		followId,
		userId: mongoSanitize(userId),
		followerUserId: mongoSanitize(followerUserId)
	})
	
	try {
		await mongoSession(async () => {
			await follow.save()
			await Profile.updateOne(
				{ _id: mongoSanitize(userId) },
				{ $inc: { 'followers': 1 } }
			)
			await Profile.updateOne(
				{ _id: mongoSanitize(followerUserId) },
				{ $inc: { 'following': 1 } }
			)
		})
		
		return deserializeFollow(follow)
	} catch(error) {
		throw new Error('Could not create follow')
	}
}

const deleteFollow = async (userId, followerUserId) => {
	const follow = await getFollow(userId, followerUserId)
	
	if (!follow) throw new Error('Could not find follow')
	
	try {
		await mongoSession(async () => {
			await Follower.deleteOne({ _id: follow.followId })
			await Profile.updateOne(
				{ _id: mongoSanitize(userId) },
				{ $inc: { 'followers': -1 } }
			)
			await Profile.updateOne(
				{ _id: mongoSanitize(followerUserId) },
				{ $inc: { 'following': -1 } }
			)
		})
		
		return { deleted: true }
	} catch(error) {
		throw new Error('Could not delete follow')
	}
}

export {
	getFollow,
	getFollowerList,
	getFollowingList,
	getFollowCount,
	getFollowingCount,
	isFollowing,
	isMutualFollower,
	createFollow,
	deleteFollow
}

export default server => {
	const router = new Router()
	
	router.get(
		'/follow/list',
		useFields({
			fields: ['userId'],
			optionalFields: ['page']
		}),
		server.oauth.authorize({ optional: true }),
		async req => {
			const userCanViewProfile = await canViewProfile(req.fields.userId, req._oauth?.user?.userId)
			
			if (!userCanViewProfile) return req.apiResult(500, {
				message: 'Not authorized to view profile'
			})
			
			req.apiResult(200, {
				followerList: await getFollowerList(req.fields.userId, req.fields.page),
				page: req.fields.page ? mongoSanitize(req.fields.page) : undefined
			})
		}
	)
	
	router.get(
		'/follow/following_list',
		useFields({
			fields: ['userId'],
			optionalFields: ['page']
		}),
		server.oauth.authorize({ optional: true }),
		async req => {
			const userCanViewProfile = await canViewProfile(req.fields.userId, req._oauth?.user?.userId)
			
			if (!userCanViewProfile) return req.apiResult(500, {
				message: 'Not authorized to view profile'
			})
			
			req.apiResult(200, {
				followingList: await getFollowingList(req.fields.userId, req.fields.page),
				page: req.fields.page ? mongoSanitize(req.fields.page) : undefined
			})
		}
	)
	
	router.get(
		'/follow/new',
		useFields({ fields: ['userId'] }),
		server.oauth.authorize(),
		async req => {
			// TODO: Add private profile follow requests
			
			try {
				req.apiResult(
					200,
					await createFollow(req.fields.userId, req._oauth.user.userId)
				)
			} catch(error) {
				req.apiResult(500, {
					message: error
				})
			}
		}
	)
	
	router.get(
		'/follow/unfollow',
		useFields({ fields: ['userId'] }),
		server.oauth.authorize(),
		async req => {
			// TODO: Add private profile follow requests
			
			try {
				req.apiResult(
					200,
					await deleteFollow(req.fields.userId, req._oauth.user.userId)
				)
			} catch(error) {
				req.apiResult(500, {
					message: error
				})
			}
		}
	)
	
	return router
}