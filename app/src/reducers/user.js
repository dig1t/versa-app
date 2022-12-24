import {
	USER_FETCH_SUCCESS,
	USER_FETCH_ERROR,
	USER_LOGGED_IN
} from '../constants/actionTypes.js'

export default (state = {
	id: null,
	loggedIn: null,
	profile: {}
}, action) => {
	switch(action.type) {
		case USER_LOGGED_IN: {
			return {
				...state,
				loggedIn: action.payload
			}
		}
		case USER_FETCH_SUCCESS: {
			return {
				...state,
				profile: action.payload
			}
		}
		default: {
			return state
		}
	}
}