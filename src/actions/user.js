import axios from 'axios'
import {
	USER_FETCH_REQUEST,
	USER_FETCH_SUCCESS,
	USER_FETCH_FAILURE,
	USER_LOGGED_IN
} from '../constants/actionTypes.js'

export const setAuthStatus = status => {
	return dispatch => dispatch({
		type: USER_LOGGED_IN,
		payload: status
	})
}

export const fetchUserData = () => {
	return dispatch => {
		dispatch({ type: USER_FETCH_REQUEST })
		
		axios.get('/api/user')
			.then(response => dispatch({
				type: USER_FETCH_SUCCESS,
				payload: response.data
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
		
		axios.get('/api/user/profile', { userId: userId || user.id })
			.then(response => dispatch({
				type: USER_FETCH_SUCCESS,
				payload: response.data
			}))
			.catch(error => dispatch({
				type: USER_FETCH_FAILURE,
				payload: error
			}))
	}
}