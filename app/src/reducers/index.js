import { combineReducers } from 'redux'

import { fetchStatus, fetchErrors } from './fetchStatus'

import user from './user'
import profiles from './profiles'
import settings from './settings'

export default combineReducers({
	fetchStatus,
	fetchErrors,
	
	settings,
	user,
	profiles
})