export const CONTENT_FETCH_REQUEST = 'CONTENT_FETCH_REQUEST'
export const CONTENT_FETCH_SUCCESS = 'CONTENT_FETCH_SUCCESS'
export const CONTENT_FETCH_FAILURE = 'CONTENT_FETCH_FAILURE'
export const CONTENT_LIKE_UPDATE_SUCCESS = 'CONTENT_LIKE_UPDATE_SUCCESS'
export const CONTENT_ADD_ARRAY = 'CONTENT_ADD_ARRAY'
export const CONTENT_STAT_UPDATE = 'CONTENT_STAT_UPDATE'
export const CONTENT_DELETE_SUCCESS = 'CONTENT_DELETE_SUCCESS'

export default (state = {
	contentList: {},
	invalidContentIds: [],
	deletedContentIds: [],
	postList: {}
}, action) => {
	switch(action.type) {
		case CONTENT_ADD_ARRAY: {
			const keys = Object.keys(action.payload)
			const newContent = {}

			keys.map((contentId) => {
				if (!state.contentList[contentId]) newContent[contentId] = action.payload[contentId]
			})

			return {
				...state,
				contentList: {
					...state.contentList,
					...newContent
				}
			}
		}

		case CONTENT_DELETE_SUCCESS: {
			const contentId = action.payload.contentId

			return {
				...state,
				deletedContentIds: state.deletedContentIds.concat(contentId),
				contentList: {
					...state.contentList,
					[contentId]: {
						...state.contentList[contentId],
						deleted: true
					}
				}
			}
		}

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
				invalidContentIds: state.invalidContentIds.concat(action.payload)
			}
		}
		case CONTENT_LIKE_UPDATE_SUCCESS: {
			const content = state.contentList[action.payload.contentId]

			return {
				...state,
				contentList: {
					...state.contentList,
					[action.payload.contentId]: {
						...content,
						liked: action.payload.liked,
						likes: content.likes + (
							action.payload.liked ? 1 : -1
						)
					}
				}
			}
		}
		case CONTENT_STAT_UPDATE: {
			const content = state.contentList[action.payload.contentId]

			if (!content) return state

			return {
				...state,
				contentList: {
					...state.contentList,
					[action.payload.contentId]: {
						...content,
						[action.payload.stat]: content[action.payload.stat] + (
							action.payload.value
						)
					}
				}
			}
		}
		default: {
			return state
		}
	}
}
