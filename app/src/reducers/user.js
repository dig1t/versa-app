import {
	USER_FETCH_SUCCESS,
	USER_LOGOUT_SUCCESS,
	USER_AUTH_FETCH_SUCCESS,
	USER_LOGGED_IN
} from '../constants/actionTypes.js'

export default (state = {
	loggedIn: null,
	userId: null,
	isAdmin: false,
	profile: {}
}, action) => {
	switch(action.type) {
		case USER_LOGGED_IN: {
			return {
				...state,
				loggedIn: action.payload
			}
		}
		case USER_LOGOUT_SUCCESS: {
			return {
				...state,
				loggedIn: null,
				userId: null,
				profile: null
			}
		}
		case USER_AUTH_FETCH_SUCCESS: {
			return {
				...state,
				loggedIn: true,
				userId: action.payload.userId,
				isAdmin: action.payload.isAdmin
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