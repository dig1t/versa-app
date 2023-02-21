import {
	PROFILE_FEED_FETCH_REQUEST,
	PROFILE_FEED_FETCH_SUCCESS,
	PROFILE_FEED_FETCH_FAILURE
} from '../constants/actionTypes.js'

import api from '../util/api.js'

export const getProfileFeed = userId => dispatch => {
	dispatch({ type: PROFILE_FEED_FETCH_REQUEST })
	
	api.get('/v1/profile/feed', { userId })
		.then(data => dispatch({
			type: PROFILE_FEED_FETCH_SUCCESS,
			payload: data
		}))
		.catch(error => dispatch({
			type: PROFILE_FEED_FETCH_FAILURE,
			payload: error
		}))
}