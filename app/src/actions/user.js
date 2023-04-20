import {
	PROFILE_FETCH_SUCCESS
} from '../reducers/profiles.js'

import {
	USER_LOGOUT_SUCCESS,
	USER_FETCH_REQUEST,
	USER_FETCH_SUCCESS,
	USER_FETCH_FAILURE,
	USER_FETCH_TOKEN_SUCCESS,
	USER_PROFILE_FETCH_REQUEST,
	USER_PROFILE_FETCH_SUCCESS,
	USER_PROFILE_FETCH_FAILURE,
	SETTINGS_FETCH_REQUEST,
	SETTINGS_FETCH_SUCCESS,
	SETTINGS_FETCH_FAILURE,
	SETTINGS_UPDATE_REQUEST,
	SETTINGS_UPDATE_SUCCESS,
	SETTINGS_UPDATE_FAILURE
} from '../reducers/user.js'

import api from '../util/api.js'

export const userLogout = (waitForServer) => (dispatch) => {
	if (waitForServer !== true) return dispatch({
		type: USER_LOGOUT_SUCCESS
	})
	
	api.call({
		method: 'post',
		url: '/auth/logout'
	})
		.then(() => {
			try {
				// eslint-disable-next-line no-undef
				localStorage.clear()
			} catch(error) {
				// eslint-disable-next-line no-undef
				console.error('Could not clear local storage', error)
			}
			
			dispatch({
				type: USER_LOGOUT_SUCCESS
			})
		})
}

export const setAuthenticatedUser = (data) => (dispatch) => {
	dispatch({
		type: USER_FETCH_SUCCESS,
		payload: data
	})
	dispatch({
		type: USER_FETCH_TOKEN_SUCCESS,
		payload: data
	})
}

export const setUserProfile = (data) => (dispatch) => dispatch({
	type: USER_PROFILE_FETCH_SUCCESS,
	payload: data
})

export const fetchUserAuth = () => (dispatch) => {
	dispatch({ type: USER_FETCH_REQUEST })
	
	api.call({
		url: '/auth/get_user'
	})
		.then((data) => {
			if (!data.user) return dispatch({
				type: USER_FETCH_FAILURE
			})
			
			dispatch({
				type: USER_FETCH_SUCCESS,
				payload: data
			})
			dispatch({
				type: USER_FETCH_TOKEN_SUCCESS,
				payload: data
			})
		})
		.catch((error) => dispatch({
			type: USER_FETCH_FAILURE,
			payload: error
		}))
}

export const fetchUserProfile = () => (dispatch, getState) => {
	const { user } = getState()
	
	dispatch({ type: USER_PROFILE_FETCH_REQUEST })
	
	api.get(`/v1/profile/${user.userId}`)
		.then((data) => {
			dispatch({
				type: USER_PROFILE_FETCH_SUCCESS,
				payload: data
			})
			dispatch({
				type: PROFILE_FETCH_SUCCESS,
				payload: data
			})
		})
		.catch((error) => dispatch({
			type: USER_PROFILE_FETCH_FAILURE,
			payload: error
		}))
}

export const fetchUserSettings = () => (dispatch, getState) => {
	const { user } = getState()
	
	dispatch({ type: SETTINGS_FETCH_REQUEST })
	
	api.get(`/v1/user/${user.userId}/settings`)
		.then((data) => dispatch({
			type: SETTINGS_FETCH_SUCCESS,
			payload: data
		}))
		.catch((error) => dispatch({
			type: SETTINGS_FETCH_FAILURE,
			payload: error
		}))
}

export const updateUserSettings = (data) => (dispatch, getState) => {
	const { user } = getState()
	
	dispatch({ type: SETTINGS_UPDATE_REQUEST })
	
	api.post(`/v1/user/${user.userId}/settings`, data)
		.then((data) => dispatch({
			type: SETTINGS_UPDATE_SUCCESS,
			payload: data
		}))
		.catch((error) => dispatch({
			type: SETTINGS_UPDATE_FAILURE,
			payload: error
		}))
}