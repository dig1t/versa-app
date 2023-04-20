import {
	PROFILE_ADD_ARRAY,
} from '../reducers/profiles.js'
import {
	CONTENT_ADD_ARRAY
} from '../reducers/content.js'

import {
	PROFILE_FEED_FETCH_REQUEST,
	PROFILE_FEED_FETCH_SUCCESS,
	PROFILE_FEED_FETCH_FAILURE,
	FEED_ADD_ARRAY
} from '../reducers/feed.js'

import api from '../util/api.js'

// export const getHomeFeed = (category) => (dispatch, getState) => {
	
// }

const addPosts = (posts, clearFeed) => (dispatch, getState) => {
	const { content } = getState()
	
	const feed = []
	const profileList = {}
	const contentList = {}
	
	posts.map((post) => {
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
	
	if (clearFeed === true) {
		dispatch({ type: PROFILE_FEED_FETCH_REQUEST })
	}
	
	dispatch({
		type: CONTENT_ADD_ARRAY,
		payload: contentList
	})
	dispatch({
		type: PROFILE_ADD_ARRAY,
		payload: profileList
	})
	dispatch({
		type: FEED_ADD_ARRAY,
		payload: feed
	})
}

export const newFeedPost = (post) => (dispatch) => {
	dispatch(addPosts([post]))
}

export const getProfileFeed = (userId) => (dispatch, getState) => {
	const { feed } = getState()
	
	if (feed.userId === userId) return
	
	dispatch({ type: PROFILE_FEED_FETCH_REQUEST })
	
	api.get(`/v1/profile/${userId}/feed`)
		.then((data) => dispatch(addPosts(data, true)))
		.catch((error) => {
			// eslint-disable-next-line no-undef
			console.error(error)
			
			dispatch({
				type: PROFILE_FEED_FETCH_FAILURE
			})
		})
}

export const getHomeFeed = () => (dispatch, getState) => {
	dispatch({ type: PROFILE_FEED_FETCH_REQUEST })
	
	api.get(`/v1/feed/home`)
		.then((data) => dispatch(addPosts(data, true)))
		.catch((error) => {
			// eslint-disable-next-line no-undef
			console.error(error)
			
			dispatch({
				type: PROFILE_FEED_FETCH_FAILURE
			})
		})
}