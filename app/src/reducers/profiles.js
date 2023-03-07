import {
	PROFILE_FETCH_SUCCESS,
	PROFILE_FETCH_FAILURE,
	PROFILE_FOLLOW_UPDATE
} from '../constants/actionTypes.js'

const findProfileIndex = (profileList, userId) => {
	let min = 0
	let max = profileList.length - 1
	
	while (min <= max) {
		const mid = (min + max) >> 1
		
		if (profileList[mid].userId === userId) {
			return mid
		} else if (profileList[mid].userId < userId) {
			min = mid + 1
		} else {
			end = mid -1
		}
	}
	
	return -1
}

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
		case PROFILE_FOLLOW_UPDATE: {
			const profileList = state.profileList.slice()
			const index = findProfileIndex(profileList, action.payload.userId)
			
			const profile = profileList[index]
			
			profileList.splice(index, 1, {
				...profile,
				connection: {
					...profile.connection,
					following: action.payload.following
				}
			})
			
			return {
				...state,
				profileList
			}
		}
		default: {
			return state
		}
	}
}