import {
	USER_PROFILE_FETCH_REQUEST,
	USER_PROFILE_FETCH_SUCCESS,
	USER_PROFILE_FETCH_FAILURE,
	USER_LOGOUT_SUCCESS,
	USER_FETCH_REQUEST,
	USER_FETCH_SUCCESS,
	USER_FETCH_FAILURE,
	PROFILE_FETCH_SUCCESS,
	USER_FETCH_TOKEN_REQUEST,
	USER_FETCH_TOKEN_SUCCESS,
	USER_FETCH_TOKEN_FAILURE
} from '../constants/actionTypes.js'

import api from '../util/api.js'

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

export const fetchUserAuth = () => dispatch => {
	dispatch({ type: USER_FETCH_REQUEST })
	
	api.call({
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

export const fetchAccessToken = () => dispatch => {
	dispatch({ type: USER_FETCH_TOKEN_REQUEST })
	
	api.get('/oauth/token', null, { customErrorHandler: true })
		.then(response => {
			dispatch({
				type: USER_FETCH_TOKEN_SUCCESS,
				payload: response.data
			})
		})
		.catch(error => dispatch({
			type: USER_FETCH_TOKEN_FAILURE,
			payload: error
		}))
}

export const fetchUserProfile = () => (dispatch, getState) => {
	const { user } = getState()
	
	dispatch({ type: USER_PROFILE_FETCH_REQUEST })
	
	api.get('/v1/user/profile', { userId: user.userId })
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