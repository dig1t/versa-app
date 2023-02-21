import {
	PROFILE_FETCH_REQUEST,
	PROFILE_FETCH_SUCCESS,
	PROFILE_FETCH_FAILURE
} from '../constants/actionTypes.js'

import api from '../util/api.js'

export const addProfile = data => dispatch => dispatch({
	type: PROFILE_FETCH_SUCCESS,
	payload: data
})

export const getProfile = userId => dispatch => {
	dispatch({ type: PROFILE_FETCH_REQUEST })
	
	api.get('/v1/profile', { userId })
		.then(data => dispatch({
			type: PROFILE_FETCH_SUCCESS,
			payload: data
		}))
		.catch(error => dispatch({
			type: PROFILE_FETCH_FAILURE,
			payload: error
		}))
}

export const getProfileFromUsername = username => dispatch => {
	dispatch({ type: PROFILE_FETCH_REQUEST })
	console.log('fetch ', username)
	api.get('/v1/profile', { username })
		.then(data => dispatch({
			type: PROFILE_FETCH_SUCCESS,
			payload: data
		}))
		.catch(error => dispatch({
			type: PROFILE_FETCH_FAILURE,
			payload: username
		}))
}