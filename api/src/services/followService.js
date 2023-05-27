import mongoose from 'mongoose'

import {
	mongoValidate,
	mongoSanitize,
	mongoSession,
	ObjectIdToString
} from '../util/mongoHelpers.js'
import { deserializeProfile } from './profileService.js'

import Follower from '../models/Follower.js'
import Profile from '../models/Profile.js'

const deserializeFollow = (follow) => ({
	followId: ObjectIdToString(follow._id),
	userId: ObjectIdToString(follow.userId),
	followerUserId: ObjectIdToString(follow.followerUserId),
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
			.select('followId requested created')
		
		return follow ? deserializeFollow({
			...follow,
			userId: mongoSanitize(userId),
			followerUserId: mongoSanitize(followerUserId)
		}) : undefined
	} catch(error) {
		throw new Error(error)
	}
}

const getFollowerList = async (userId, page = 1, limit = 10) => {
	const followers = await Follower.find({ userId: mongoSanitize(userId) })
		.skip((page - 1) * limit)
		.limit(limit)
	
	const followerIds = followers.map(follow => follow.followerUserId)
	const profiles = await Profile.find({ _id: { $in: followerIds }})
	
	return profiles.map((profile) => deserializeProfile(profile, userId))
}

const getFollowingList = async (userId, page = 1, limit = 10) => {
	const following = await Follower.find({ followerUserId: mongoSanitize(userId) })
		.skip((page - 1) * limit)
		.limit(limit)
	
	const followingIds = following.map(follow => follow.userId)
	const profiles = await Profile.find({ _id: { $in: followingIds }})
	
	return profiles.map((profile) => deserializeProfile(profile, userId))
}

const isFollowing = async (userId, followerUserId) => {
	if (typeof followerUserId === 'undefined') return false
	
	if (userId === followerUserId) return false
	
	try {
		const follows = await Follower.findOne({
			userId: mongoSanitize(followerUserId),
			followerUserId: mongoSanitize(userId),
			requested: { $ne: true }
		})
			.select('followId')
		
		return follows && typeof follows.followId !== 'undefined'
	} catch(error) {
		console.log(error)
		
		return false
	}
}

const isMutualFollower = async (userId, followerUserId) => {
	if (typeof followerUserId === 'undefined') return false
	
	if (userId === followerUserId) return true
	
	try {
		const [follows, followedBy] = await Promise.all([
			isFollowing(followerUserId, userId),
			isFollowing(userId, followerUserId)
		])
		
		return Boolean(follows && followedBy)
	} catch(error) {
		console.log(error)
		
		return false
	}
}

const getFollowCount = async (userId) => {
	const profile = await Profile.findOne({ _id: mongoSanitize(userId) })
		.select('followers')
	
	if (!profile || typeof profile.followers !== 'number') throw new Error('Profile does not exist')
	
	return profile.followers
}

const getFollowingCount = async (userId) => {
	const profile = await Profile.findOne({ _id: mongoSanitize(userId) })
		.select('following')
	
	if (!profile || typeof profile.following !== 'number') throw new Error('Profile does not exist')
	
	return profile.following
}

const getConnection = async (userId, requesterUserId) => {
	if (!userId) throw new Error('getConnection(): Missing userId')
	if (!requesterUserId) throw new Error('getConnection(): Missing requester userId')
	
	const isSelf = userId === requesterUserId
	const following = !isSelf && await isFollowing(requesterUserId, userId)
	const followedBy = !isSelf && await isFollowing(userId, requesterUserId)
	
	return {
		isSelf,
		following,
		followedBy,
		isMutualFollower: following && followedBy
	}
}

const createFollow = async (userId, followerUserId) => {
	if (!userId) throw new Error('Missing userId')
	if (!followerUserId) throw new Error('Missing followerUserId')
	
	if (!mongoValidate(userId, 'id') || !mongoValidate(followerUserId, 'id')) {
		throw new Error(`Invalid userId`)
	}
	
	const isFollowing = await getFollow(userId, followerUserId, true)
	
	if (isFollowing) {
		throw new Error('User is already following the targeted user')
	}
	
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
		
		return {
			...deserializeFollow(follow),
			following: true
		}
	} catch(error) {
		throw new Error('Could not follow the target user')
	}
}

const deleteFollow = async (userId, followerUserId) => {
	const follow = await getFollow(userId, followerUserId)
	
	if (!follow) throw new Error('User is not following target user')
	
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
		
		return { following: false }
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
	getConnection,
	createFollow,
	deleteFollow
}