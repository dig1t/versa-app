import {
	PROFILE_FEED_FETCH_REQUEST,
	PROFILE_FEED_FETCH_SUCCESS,
	PROFILE_FEED_FETCH_FAILURE,
	PROFILE_ADD_ARRAY,
	CONTENT_ADD_ARRAY
} from '../constants/actionTypes.js'

import api from '../util/api.js'

export const getHomeFeed = category => (dispatch, getState) => {
	
}

export const getProfileFeed = userId => (dispatch, getState) => {
	const { feed, profiles, content } = getState()
	
	if (feed.userId === userId) return
	
	dispatch({ type: PROFILE_FEED_FETCH_REQUEST })
	
	api.get(`/v1/profile/${userId}/feed`)
		.then(data => {
			const feed = []
			const profileList = {}
			const contentList = {}
			
			data.map(post => {
				const { profile: postProfile, content: _contentData, ...postData } = post
				const { profile: contentProfile, ...contentData } = _contentData
				
				if (!profileList[postProfile.userId]) profileList[postProfile.userId] = postData.postProfile
				if (!profileList[contentProfile.userId]) profileList[contentProfile.userId] = contentProfile
				if (!content.contentList[contentData.contentId]) contentList[contentData.contentId] = {
					...contentData,
					userId: contentProfile.userId
				}
				
				feed.push({
					...postData,
					contentId: contentData.contentId,
					userId: postProfile.userId
				})
				
			})
			
			dispatch({
				type: CONTENT_ADD_ARRAY,
				payload: contentList
			})
			dispatch({
				type: PROFILE_ADD_ARRAY,
				payload: profileList
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