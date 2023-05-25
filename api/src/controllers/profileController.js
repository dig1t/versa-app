import validateText from '../util/validateText.js'

import { getConnection } from '../services/followService.js'

import {
	getProfileFromUserId,
	getProfileFromUsername,
	canViewProfile,
	getProfilePosts
} from '../services/profileService.js'

export default {
	getProfile: async (req) => {
		try {
			if (!req.params?.userId && !req.params?.username) {
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
	},
	
	getProfileFeed: async (req) => {
		try {
			const userCanViewProfile = await canViewProfile(
				req.params.userId, req._oauth?.user?.userId
			)
			
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
}