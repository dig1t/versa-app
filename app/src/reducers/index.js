import { combineReducers } from 'redux'

import { fetchStatus, fetchErrors } from './fetchStatus.js'

import user from './user.js'
import profiles from './profiles.js'
import content from './content.js'
import feed from './feed.js'

export default combineReducers({
	fetchStatus,
	fetchErrors,
	
	user,
	profiles,
	content,
	feed
})