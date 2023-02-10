import {
	USER_PROFILE_FETCH_REQUEST,
	USER_PROFILE_FETCH_SUCCESS,
	USER_PROFILE_FETCH_FAILURE,
	USER_LOGOUT_SUCCESS,
	USER_FETCH_REQUEST,
	USER_FETCH_SUCCESS,
	USER_FETCH_FAILURE,
	PROFILE_FETCH_SUCCESS
} from '../constants/actionTypes.js'

import { apiGet, apiCall } from '../util/api.js'
import { suspenseWrap } from '../util/suspenseWrap.js'

export const userLogout = status => dispatch => dispatch({
	type: USER_LOGOUT_SUCCESS
})

export const setAuthenticatedUser = data => dispatch => dispatch({
	type: USER_FETCH_SUCCESS,
	payload: data
})

export const setUserProfile = data => dispatch => dispatch({
	type: USER_PROFILE_FETCH_SUCCESS,
	payload: data
})

export const fetchUserSuspenseful = dispatch => suspenseWrap(new Promise(resolve => {
	apiCall({ url: '/auth/get_user' })
		.then(data => {
			dispatch({
				type: USER_FETCH_SUCCESS,
				payload: data
			})
			resolve()
		})
		.catch(() => {
			dispatch({
				type: USER_FETCH_FAILURE
			})
			resolve()
		})
}))

export const fetchUserAuth = () => dispatch => {
	dispatch({ type: USER_FETCH_REQUEST })
	
	apiCall({
		url: '/auth/get_user',
		withCredentials: true
	})
		.then(data => dispatch({
			type: USER_FETCH_SUCCESS,
			payload: data
		}))
		.catch(error => dispatch({
			type: USER_FETCH_FAILURE,
			payload: error
		}))
}

export const fetchUserProfile = () => (dispatch, getState) => {
	const { user } = getState()
	
	dispatch({ type: USER_PROFILE_FETCH_REQUEST })
	
	apiGet('/user/profile', { userId: user.userId })
		.then(data => {
			dispatch({
				type: USER_PROFILE_FETCH_SUCCESS,
				payload: data
			})
			dispatch({
				type: PROFILE_FETCH_SUCCESS,
				payload: data
			})
		})
		.catch(error => dispatch({
			type: USER_PROFILE_FETCH_FAILURE,
			payload: error
		}))
}