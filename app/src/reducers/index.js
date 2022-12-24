import { combineReducers } from 'redux'

import { fetchStatus, fetchErrors } from './fetchStatus'

import user from './user'
import profiles from './profiles'

export default combineReducers({
	fetchStatus,
	fetchErrors,
	
	user,
	profiles
})