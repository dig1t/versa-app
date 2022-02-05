export const FETCH_USERS = 'FETCH_USERS'

export const FETCH_USERS_SUCCESS = 'FETCH_USERS_SUCCESS'

export const FETCH_USERS_ERROR = 'FETCH_USERS_ERROR'

const reducer = (state={
	users: [],
	fetching: false,
	fetched: false,
	error: null
}, action) => {
	switch(action.type) {
		case FETCH_USERS: {
			return {...state, fetching: true}
		}
		
		case FETCH_USERS_SUCCESS: {
			return {...state, fetching: false, fetched: true, users: action.payload}
		}
		
		case FETCH_USERS_ERROR: {
			return {...state, fetching: false, error: action.payload}
		}
	}
	
	return state // default
}

export default reducer