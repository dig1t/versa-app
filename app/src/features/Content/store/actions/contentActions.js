import {
	CONTENT_FETCH_SUCCESS,
	CONTENT_FETCH_FAILURE,
	CONTENT_STAT_UPDATE,
	CONTENT_LIKE_UPDATE_SUCCESS,
	CONTENT_DELETE_SUCCESS
} from '../reducers/contentReducers.js'
import { PROFILE_FETCH_SUCCESS } from '../../../User/store/reducers/profileReducers.js'

import api from '../../../../util/api.js'

export const getContent = (contentId) => (dispatch, getState) => {
	const { content, profiles } = getState()
	
	if (content.contentList[contentId]) return
	
	api.get(`/v1/content/${contentId}`)
		.then((data) => {
			const { profile, ...content } = data
			
			if (!profiles.profileList[profile.userId]) dispatch({
				type: PROFILE_FETCH_SUCCESS,
				payload: profile
			})
			
			dispatch({
				type: CONTENT_FETCH_SUCCESS,
				payload: {
					...content,
					userId: profile.userId
				}
			})
		})
		.catch(() => dispatch({
			type: CONTENT_FETCH_FAILURE,
			payload: contentId
		}))
}

export const addContentStat = (contentId, stat, value) => (dispatch) => {
	dispatch({
		type: CONTENT_STAT_UPDATE,
		payload: { contentId, stat, value }
	})
}

/*export const deleteContent = (contentId) => (dispatch, getState) => {
	const { content } = getState()
	
	if (!content.contentList[contentId]) return
	
	api.delete(`/v1/content/${contentId}`, { contentId })
		.then(() => {
			dispatch({
				type: CONTENT_DELETE_SUCCESS,
				payload: {
					contentId
				}
			})
		})
		.catch((error) => {
			console.log('content delete error')
			console.log('deleteContent', error)
			// TODO: add toast notification for error
		})
}*/

export const addLike = (contentId) => (dispatch, getState) => {
	const { content } = getState()
	
	if (!content.contentList[contentId]) return
	
	api.post(`/v1/content/${contentId}/like`, { contentId })
		.then((data) => {
			dispatch({
				type: CONTENT_LIKE_UPDATE_SUCCESS,
				payload: {
					liked: typeof data.likeId !== 'undefined',
					contentId
				}
			})
		})
		.catch((error) => {
			// TODO: add toast notification for error
		})
}

export const deleteLike = (contentId) => (dispatch, getState) => {
	const { content } = getState()
	
	if (!content.contentList[contentId]) return
	
	api.delete(`/v1/content/${contentId}/like`, { contentId })
		.then((data) => {
			dispatch({
				type: CONTENT_LIKE_UPDATE_SUCCESS,
				payload: {
					liked: data.deleted && false,
					contentId
				}
			})
		})
		.catch((error) => {
			// TODO: add toast notification for error
		})
}