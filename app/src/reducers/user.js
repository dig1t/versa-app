import {
	USER_LOGGED_IN,
	USER_LOGOUT_SUCCESS,
	USER_FETCH_SUCCESS,
	USER_FETCH_FAILURE,
	USER_PROFILE_FETCH_SUCCESS
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
				loggedIn: false,
				userId: null,
				profile: null
			}
		}
		case USER_FETCH_SUCCESS: {
			return {
				...state,
				loggedIn: true,
				userId: action.payload.userId,
				isAdmin: action.payload.isAdmin,
				isMod: action.payload.isMod
			}
		}
		case USER_FETCH_FAILURE: {
			return {
				...state,
				loggedIn: false
			}
		}
		case USER_PROFILE_FETCH_SUCCESS: {
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