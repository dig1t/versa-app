import {
	PROFILE_FETCH_SUCCESS
} from '../constants/actionTypes.js'

export default (state = {
	profileList: []
}, action) => {
	switch(action.type) {
		case PROFILE_FETCH_SUCCESS: {
			const profileExists = state.profileList.find(
				profile => profile.userId === action.payload.userId
			)
			
			return profileExists ? state : {
				...state,
				// using concat on the data object makes adding profiles quicker
				profileList: state.profileList.concat(action.payload)
			}
		}
		default: {
			return state
		}
	}
}