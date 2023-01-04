import {
	PROFILE_FETCH_SUCCESS
} from '../constants/actionTypes.js'

export default (state = {
	data: []
}, action) => {
	switch(action.type) {
		case PROFILE_FETCH_SUCCESS: {
			const profileExists = state.data.find(
				profile => profile.userId === action.payload.userId
			)
			
			return profileExists ? state : {
				...state,
				// using concat on the data object makes adding profiles quicker
				data: state.data.concat(action.payload)
			}
		}
		default: {
			return state
		}
	}
}