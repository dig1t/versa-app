import {
	PROFILE_FETCH_SUCCESS,
	PROFILE_FETCH_FAILURE,
	PROFILE_FOLLOW_UPDATE
} from '../constants/actionTypes.js'

export default (state = {
	profileList: {},
	idsByUsername: {},
	invalidUsernames: []
}, action) => {
	switch(action.type) {
		case PROFILE_FETCH_SUCCESS: {
			return {
				...state,
				// using concat on the data object makes adding profiles quicker
				profileList: {
					...state.profileList,
					[action.payload.userId]: action.payload
				},
				idsByUsername: {
					...state.idsByUsername,
					[action.payload.username]: action.payload.userId
				}
			}
		}
		case PROFILE_FETCH_FAILURE: {
			return {
				...state,
				invalidUsernames: state.invalidUsernames.concat(action.payload)
			}
		}
		case PROFILE_FOLLOW_UPDATE: {
			const profile = state.profileList[action.payload.userId]
			
			return profile ? {
				...state,
				profileList: {
					...state.profileList,
					[action.payload.userId]: {
						...profile,
						connection: {
							...profile.connection,
							following: action.payload.following
						},
						followers: profile.followers + (
							action.payload.following ? 1 : -1
						)
					}
				}
			} : state
		}
		default: {
			return state
		}
	}
}