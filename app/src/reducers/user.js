export const USER_FETCH_REQUEST = 'USER_FETCH_REQUEST'
export const USER_FETCH_SUCCESS = 'USER_FETCH_SUCCESS'
export const USER_FETCH_FAILURE = 'USER_FETCH_FAILURE'

export const USER_PROFILE_FETCH_REQUEST = 'USER_PROFILE_FETCH_REQUEST'
export const USER_PROFILE_FETCH_SUCCESS = 'USER_PROFILE_FETCH_SUCCESS'
export const USER_PROFILE_FETCH_FAILURE = 'USER_PROFILE_FETCH_FAILURE'

export const USER_FETCH_TOKEN_REQUEST = 'USER_FETCH_TOKEN_REQUEST'
export const USER_FETCH_TOKEN_SUCCESS = 'USER_FETCH_TOKEN_SUCCESS'
export const USER_FETCH_TOKEN_FAILURE = 'USER_FETCH_TOKEN_FAILURE'

export const USER_LOGOUT_SUCCESS = 'USER_LOGOUT_SUCCESS'
export const USER_UPDATE = 'USER_UPDATE'

export const SETTINGS_FETCH_REQUEST = 'SETTINGS_FETCH_REQUEST'
export const SETTINGS_FETCH_SUCCESS = 'SETTINGS_FETCH_SUCCESS'
export const SETTINGS_FETCH_FAILURE = 'SETTINGS_FETCH_FAILURE'

export const SETTINGS_UPDATE_REQUEST = 'SETTINGS_UPDATE_REQUEST'
export const SETTINGS_UPDATE_SUCCESS = 'SETTINGS_UPDATE_SUCCESS'
export const SETTINGS_UPDATE_FAILURE = 'SETTINGS_UPDATE_FAILURE'

export const SETTINGS_UPDATE = 'SETTINGS_UPDATE'

export default (state = {
	authenticated: null,
	userId: null,
	email: null,
	accessToken: null,
	isAdmin: false,
	profile: {},
	settings: {
		appTheme: 'light'
	}
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
				email: action.payload.user.email,
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
		case USER_UPDATE:
			return (action.payload.key === undefined || action.payload.value === undefined) ? state : {
				...state,
				[action.payload.key]: action.payload.value
			}
		
		case SETTINGS_FETCH_SUCCESS: {
			return {
				...state,
				settings: action.payload
			}
		}
		case SETTINGS_UPDATE:
			return (action.payload.key === undefined || action.payload.value === undefined) ? state : {
				...state,
				settings: {
					...state.settings,
					[action.payload.key]: action.payload.value
				}
			}
		
		default: {
			return state
		}
	}
}