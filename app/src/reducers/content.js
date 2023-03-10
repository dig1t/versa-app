import {
	CONTENT_FETCH_SUCCESS,
	CONTENT_FETCH_FAILURE
} from '../constants/actionTypes.js'

export default (state = {
	contentList: {},
	invalidContentIds: [],
	postList: {}
}, action) => {
	switch(action.type) {
		case CONTENT_FETCH_SUCCESS: {
			return {
				...state,
				contentList: {
					...state.contentList,
					[action.payload.contentId]: action.payload
				}
			}
		}
		case CONTENT_FETCH_FAILURE: {
			return {
				...state,
				invalidContentIds: invalidContentIds.concat(action.payload)
			}
		}
		default: {
			return state
		}
	}
}