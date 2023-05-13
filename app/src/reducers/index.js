import { combineReducers } from 'redux'

import { fetchStatus, fetchErrors } from './fetchStatus.js'

import selfReducers from '../features/User/store/reducers/selfReducers.js'
import userReducers from '../features/User/store/reducers/userReducers.js'
import profileReducers from '../features/User/store/reducers/profileReducers.js'
import content from './content.js'
import feed from './feed.js'

export default combineReducers({
	fetchStatus,
	fetchErrors,
	
	user: selfReducers,
	users: userReducers,
	profiles: profileReducers,
	content,
	feed
})