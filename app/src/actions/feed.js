import {
	PROFILE_FEED_FETCH_REQUEST,
	PROFILE_FEED_FETCH_SUCCESS,
	PROFILE_FEED_FETCH_FAILURE,
	PROFILE_ADD_ARRAY
} from '../constants/actionTypes.js'

import api from '../util/api.js'

export const getHomeFeed = category => (dispatch, getState) => {
	
}

export const getProfileFeed = userId => (dispatch, getState) => {
	const { feed, profiles } = getState()
	
	if (feed.userId === userId) return
	
	dispatch({ type: PROFILE_FEED_FETCH_REQUEST })
	
	api.get(`/v1/profile/${userId}/feed`)
		.then(data => {
			const feed = []
			const profiles = {}
			
			data.map(post => {
				const { profile: postProfile, content: _contentData, ...postData } = post
				const { profile: contentProfile, ...contentData } = _contentData
				
				if (!profiles[postProfile.userId]) profiles[postProfile.userId] = postData.postProfile
				if (!profiles[contentProfile.userId]) profiles[contentProfile.userId] = contentProfile
				
				feed.push({
					...postData,
					content: {
						...contentData,
						userId: contentProfile.userId
					},
					userId: postProfile.userId
				})
			})
			
			console.log('FEED', feed)
			console.log('profiles', profiles)
			dispatch({
				type: PROFILE_ADD_ARRAY,
				payload: profiles
			})
			dispatch({
				type: PROFILE_FEED_FETCH_SUCCESS,
				payload: feed
			})
		})
		.catch(error => {
		console.error(error)
		dispatch({
			type: PROFILE_FEED_FETCH_FAILURE
		})
		})
}