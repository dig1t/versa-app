import {
	FEED_FETCH_REQUEST,
	FEED_FETCH_SUCCESS,
	FEED_NEW_POST,
	FEED_NEW_PAGE,
	PROFILE_FEED_FETCH_REQUEST,
	PROFILE_FEED_FETCH_SUCCESS
} from '../constants/actionTypes.js'

export default (state = {
	posts: []
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