export const FEED_FETCH_REQUEST = 'FEED_FETCH_REQUEST'
export const FEED_FETCH_SUCCESS = 'FEED_FETCH_SUCCESS'
export const FEED_FETCH_FAILURE = 'FEED_FETCH_FAILURE'
export const FEED_NEW_PAGE = 'FEED_NEW_PAGE'
export const FEED_ADD_ARRAY = 'FEED_ADD_ARRAY'

export const PROFILE_FEED_FETCH_REQUEST = 'PROFILE_FEED_FETCH_REQUEST'
export const PROFILE_FEED_FETCH_SUCCESS = 'PROFILE_FEED_FETCH_SUCCESS'
export const PROFILE_FEED_FETCH_FAILURE = 'PROFILE_FEED_FETCH_FAILURE'

export const FEED_POST_DELETE_SUCCESS = 'FEED_POST_DELETE_SUCCESS'

export default (state = {
	posts: [],
	userId: null,
	type: null,
	loading: false
}, action) => {
	switch(action.type) {
		case FEED_FETCH_REQUEST:
		case PROFILE_FEED_FETCH_REQUEST: {
			return {
				...state,
				posts: []
			}
		}
		
		case FEED_POST_DELETE_SUCCESS: {
			// find post index from postId
			// remove post from posts array
			return {
				...state,
				posts: state.posts.filter((post) => post.postId !== action.payload.postId)
			}
		}
		
		case FEED_FETCH_SUCCESS:
		case PROFILE_FEED_FETCH_SUCCESS: {
			return {
				...state,
				posts: action.payload
			}
		}
		
		case FEED_ADD_ARRAY: {
			const posts = state.posts
			
			return {
				...state,
				posts: action.payload.concat(posts)
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