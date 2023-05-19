import config from '../constants/config.js'
import { getProfileFromUserId } from './profileService.js'

const homeFeedPipeline = async (_options) => {
	const options = {
		canViewContent: false,
		requesterUserId: '0',
		
		..._options
	}
	
	if (!options.userId) throw new Error('profileFeedPipeline: Missing userId')
	
	const profile = await getProfileFromUserId(options.userId)
	
	if (!profile) throw new Error('Could not find profile')
	
	return [
		{ $sort: {
			created: -1
		} },
		{ $limit: config.profile.maxFeedPagePosts },
		{ $addFields: {
			postId: '$_id'
		} },
		{ $project: {
			type: 0,
			__v: 0
		} }
	]
}

export {
	homeFeedPipeline
}