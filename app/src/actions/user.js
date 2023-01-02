import {
	USER_FETCH_REQUEST,
	USER_FETCH_SUCCESS,
	USER_FETCH_FAILURE,
	USER_AUTH_FETCH_REQUEST,
	USER_AUTH_FETCH_SUCCESS,
	USER_AUTH_FETCH_FAILURE,
	USER_LOGGED_IN
} from '../constants/actionTypes.js'

import { apiGet, apiCall } from '../util/api.js'

export const setAuthStatus = status => {
	return dispatch => dispatch({
		type: USER_LOGGED_IN,
		payload: status
	})
}

export const setAuthenticatedUser = data => {
	return dispatch => dispatch({
		type: USER_AUTH_FETCH_SUCCESS,
		payload: data
	})
}

// REMOVE?
export const fetchUserAuth = () => {
	return dispatch => {
		dispatch({ type: USER_AUTH_FETCH_REQUEST })
		
		apiCall({ url: '/auth/get_user' })
			.then(data => dispatch({
				type: USER_AUTH_FETCH_SUCCESS,
				payload: data
			}))
			.catch(error => dispatch({
				type: USER_AUTH_FETCH_FAILURE,
				payload: error
			}))
	}
}

export const fetchUserData = () => {
	return dispatch => {
		dispatch({ type: USER_FETCH_REQUEST })
		
		apiGet('/user')
			.then(data => dispatch({
				type: USER_FETCH_SUCCESS,
				payload: data
			}))
			.catch(error => dispatch({
				type: USER_FETCH_FAILURE,
				payload: error
			}))
	}
}

export const fetchProfileData = userId => {
	return (dispatch, getState) => {
		const { user } = getState()
		
		dispatch({ type: USER_FETCH_REQUEST })
		
		apiGet('/user/profile', { userId: userId || user.id })
			.then(data => dispatch({
				type: USER_FETCH_SUCCESS,
				payload: data
			}))
			.catch(error => dispatch({
				type: USER_FETCH_FAILURE,
				payload: error
			}))
	}
}