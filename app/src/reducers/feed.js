export const FEED_FETCH_REQUEST = 'FEED_FETCH_REQUEST'
export const FEED_FETCH_SUCCESS = 'FEED_FETCH_SUCCESS'
export const FEED_FETCH_FAILURE = 'FEED_FETCH_FAILURE'
export const FEED_NEW_POST = 'FEED_NEW_POST'
export const FEED_NEW_PAGE = 'FEED_NEW_PAGE'

export const PROFILE_FEED_FETCH_REQUEST = 'PROFILE_FEED_FETCH_REQUES'
export const PROFILE_FEED_FETCH_SUCCESS = 'PROFILE_FEED_FETCH_SUCCESS'
export const PROFILE_FEED_FETCH_FAILURE = 'PROFILE_FEED_FETCH_FAILURE'

export default (state = {
	posts: [],
	userId: null,
	type: null
}, action) => {
	switch(action.type) {
		case FEED_FETCH_REQUEST:
		case PROFILE_FEED_FETCH_REQUEST: {
			return {
				...state,
				posts: []
			}
		}
		case FEED_FETCH_SUCCESS:
		case PROFILE_FEED_FETCH_SUCCESS: {
			return {
				...state,
				posts: action.payload
			}
		}
		case FEED_NEW_POST: {
			return {
				...state,
				posts: [action.payload].concat(state.posts)
			}
		}
		case FEED_NEW_PAGE: {
			return {
				...state,
				posts: state.posts.concat(action.payload)
			}
		}
		default: {
			return state
		}
	}
}