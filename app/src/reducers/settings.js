import {
	SETTINGS_FETCH_SUCCESS
} from '../constants/actionTypes.js'

export default (state = {
	appTheme: 'light'
}, action) => {
	switch(action.type) {
		case SETTINGS_FETCH_SUCCESS: {
			return {
				...state,
				appTheme: action.payload.appTheme
			}
		}
		default: {
			return state
		}
	}
}