import { mongoSanitize } from '../util/mongoHelpers.js'

import { canViewProfile } from '../services/profileService.js'

import {
	getFollowerList,
	getFollowingList,
	getConnection,
	createFollow,
	deleteFollow
} from '../services/followService.js'

export default {
	getFollowConnection: async (req) => {
		req.apiResult(200, {
			connection: await getConnection(req.fields.userId, req._oauth.user.userId),
			userId: mongoSanitize(req.fields.userId)
		})
	},
	
	getFollowList: async (req) => {
		const userCanViewProfile = await canViewProfile(req.fields.userId, req._oauth?.user?.userId)
		
		if (!userCanViewProfile) return req.apiResult(500, {
			message: 'Not authorized to view profile'
		})
		
		req.apiResult(200, {
			followerList: await getFollowerList(req.fields.userId, req.fields.page),
			page: req.fields.page ? mongoSanitize(req.fields.page) : undefined
		})
	},
	
	getFollowingList: async (req) => {
		const userCanViewProfile = await canViewProfile(req.fields.userId, req._oauth?.user?.userId)
		
		if (!userCanViewProfile) return req.apiResult(500, {
			message: 'Not authorized to view profile'
		})
		
		req.apiResult(200, {
			followingList: await getFollowingList(req.fields.userId, req.fields.page),
			page: req.fields.page ? mongoSanitize(req.fields.page) : undefined
		})
	},
	
	postFollowNew: async (req) => {
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
	},
	
	postUnfollow: async (req) => {
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
}