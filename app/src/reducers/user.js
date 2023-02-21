import {
	USER_LOGOUT_SUCCESS,
	USER_FETCH_SUCCESS,
	USER_FETCH_FAILURE,
	USER_FETCH_TOKEN_SUCCESS,
	USER_PROFILE_FETCH_SUCCESS
} from '../constants/actionTypes.js'

export default (state = {
	authenticated: null,
	userId: null,
	accessToken: null,
	isAdmin: false,
	profile: {}
}, action) => {
	switch(action.type) {
		case USER_LOGOUT_SUCCESS: {
			return {
				...state,
				userId: null,
				accessToken: null,
				isAdmin: false,
				profile: {}
			}
		}
		case USER_FETCH_SUCCESS: {
			return {
				...state,
				authenticated: true,
				userId: action.payload.user.userId,
				isAdmin: action.payload.user.isAdmin,
				isMod: action.payload.user.isMod
			}
		}
		case USER_FETCH_FAILURE: {
			return {
				...state,
				authenticated: false
			}
		}
		case USER_FETCH_TOKEN_SUCCESS: {
			return {
				...state,
				accessToken: action.payload.access_token
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