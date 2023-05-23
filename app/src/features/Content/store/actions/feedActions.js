import {
	PROFILE_ADD_ARRAY,
} from '../../../User/store/reducers/profileReducers.js'
import {
	CONTENT_ADD_ARRAY
} from '../reducers/contentReducers.js'

import {
	PROFILE_FEED_FETCH_REQUEST,
	PROFILE_FEED_FETCH_FAILURE,
	FEED_POST_DELETE_SUCCESS,
	FEED_ADD_ARRAY
} from '../reducers/feedReducers.js'

import api from '../../../../util/api.js'
import { binarySearch } from '../../../../util/binarySearch.js'

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

export const deleteFeedPost = (postId) => (dispatch, getState) => {
	const { feed } = getState()
	
	const postIndex = binarySearch(feed.posts, postId)
	
	if (postIndex > -1) return
	
	api.delete(`/v1/post/${postId}`, { postId })
		.then(() => {
			dispatch({
				type: FEED_POST_DELETE_SUCCESS,
				payload: {
					postId
				}
			})
		})
		.catch((error) => {
			console.log('post delete error')
			console.log('deleteFeedPost', error)
			// TODO: add toast notification for error
		})
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