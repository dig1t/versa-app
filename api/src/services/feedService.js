import { getProfileFromUserId } from './profileService.js'
import Follower from '../models/Follower.js'
import Post from '../models/Post.js'
import mongoose, { ObjectId } from 'mongoose'

const postLimitPerUser = 10
const feedLimit = 50

const homeFeedPipeline = async (_options) => {
	const options = {
		page: 1,
		..._options
	}
	
	if (!options.userId) throw new Error('homeFeedPipeline: Missing userId')
	
	return await Follower.aggregate([
		// Get all users that are being followed by the requester
		{ '$match': {
			followerUserId: new mongoose.Types.ObjectId(options.userId)
		} },
		
		{ $lookup: {
			from: Post.collection.name,
			let: { followed_user_id: '$userId' },
			pipeline: [
				{ $match: {
					$expr: {
						$eq: ['$userId', '$$followed_user_id']
					}
				} },
				
				{ $sort: {
					created: -1
				} },
				
				{ $limit: postLimitPerUser }
			],
			as: 'userPosts'
		} },
		
		{ $unwind: '$userPosts' },
		
		{ $replaceRoot: {
			newRoot: '$userPosts'
		} },
		
		{ $sort: {
			created: -1
		} },
		
		{ $skip: feedLimit * (options.page - 1) },
		
		{ $limit: feedLimit }
	])
}

export {
	homeFeedPipeline
}