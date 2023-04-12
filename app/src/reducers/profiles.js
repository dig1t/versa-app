export const PROFILE_ADD_ARRAY = 'PROFILE_ADD_ARRAY'
export const PROFILE_UPDATE = 'PROFILE_UPDATE'

export const PROFILE_FETCH_REQUEST = 'PROFILE_FETCH_REQUEST'
export const PROFILE_FETCH_SUCCESS = 'PROFILE_FETCH_SUCCESS'
export const PROFILE_FETCH_FAILURE = 'PROFILE_FETCH_FAILURE'

export const PROFILE_FOLLOW_UPDATE = 'PROFILE_FOLLOW_UPDATE'

export const PROFILE_CONNECTION_SUCCESS = 'PROFILE_CONNECTION_SUCCESS'

export default (state = {
	profileList: {},
	idsByUsername: {},
	invalidUsernames: []
}, action) => {
	switch(action.type) {
		case PROFILE_ADD_ARRAY: {
			const keys = Object.keys(action.payload)
			const newProfiles = {}
			const newUsernames = {}
			
			keys.map(userId => {
				if (!state.profileList[userId]) newProfiles[userId] = action.payload[userId]
			})
			
			keys.map(userId => {
				const username = action.payload[userId].username
				
				if (!newUsernames[username]) newUsernames[username] = userId
			})
			
			return {
				...state,
				profileList: {
					...state.profileList,
					...newProfiles
				},
				idsByUsername: {
					...state.idsByUsername,
					...newUsernames
				}
			}
		}
		case PROFILE_UPDATE: {
			const profile = state.profileList[action.payload.userId]
			
			return profile ? {
				...state,
				profileList: {
					...state.profileList,
					[action.payload.userId]: {
						...profile,
						...action.payload.profile,
						[action.payload.key]: action.payload.value
					}
				}
			} : state
		}
		case PROFILE_CONNECTION_SUCCESS: {
			if (!state.profileList[action.payload.userId]) return state
			
			return {
				...state,
				profileList: {
					...state.profileList,
					[action.payload.userId]: {
						...state.profileList[action.payload.userId],
						connection: action.payload.connection
					}
				}
			}
		}
		case PROFILE_FETCH_SUCCESS: {
			return {
				...state,
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