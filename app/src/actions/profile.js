import {
	PROFILE_FETCH_REQUEST,
	PROFILE_FETCH_SUCCESS,
	PROFILE_FETCH_FAILURE
} from '../constants/actionTypes.js'

export const addUserProfile = data => dispatch => dispatch({
	type: PROFILE_FETCH_SUCCESS,
	payload: data
})