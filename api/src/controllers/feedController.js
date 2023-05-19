import Post from '../models/Post.js'
import { getProfileFromUserId } from '../services/profileService.js'
import { deserializePost, getContent } from '../services/contentService.js'
import {
	homeFeedPipeline
} from '../services/feedService.js'

export default {
	getHomeFeed: async (req) => {
		try {
			const requesterUserId = req._oauth.user.userId
			
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
			
			/*/
			// Post
			{
				...post,
				content: {
					...contentData,
					profile
				},
			}*/
			const feed = posts.map((post) => ({
				...deserializePost(post),
				profile: profileCache.find(
					(data) => data.userId === post.userId.toHexString()
				)
			}))
			
			req.apiResult(200, feed)
		} catch(error) {
			req.apiResult(500, {
				message: error
			})
		}
	}
}