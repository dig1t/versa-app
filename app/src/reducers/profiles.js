import {
	PROFILE_FETCH_SUCCESS,
	PROFILE_FETCH_FAILURE
} from '../constants/actionTypes.js'

export default (state = {
	profileList: [],
	invalidProfiles: []
}, action) => {
	switch(action.type) {
		case PROFILE_FETCH_SUCCESS: {
			// Check to avoid adding a duplicate
			const profileExists = state.profileList.find(
				profile => profile.userId === action.payload.userId
			)
			
			return profileExists ? state : {
				...state,
				// using concat on the data object makes adding profiles quicker
				profileList: state.profileList.concat(action.payload)
			}
		}
		case PROFILE_FETCH_FAILURE: {
			return {
				...state,
				invalidProfiles: state.invalidProfiles.concat(action.payload)
			}
		}
		default: {
			return state
		}
	}
}