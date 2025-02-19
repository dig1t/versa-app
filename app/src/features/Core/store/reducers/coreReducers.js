import { combineReducers } from 'redux'

import { fetchStatus, fetchErrors } from './fetchStatus.js'

import selfReducers from '../../../User/store/reducers/selfReducers.js'
import userReducers from '../../../User/store/reducers/userReducers.js'
import profileReducers from '../../../User/store/reducers/profileReducers.js'
import contentReducers from '../../../Content/store/reducers/contentReducers.js'
import feedReducers from '../../../Content/store/reducers/feedReducers.js'

export default combineReducers({
	fetchStatus,
	fetchErrors,

	user: selfReducers,
	users: userReducers,
	profiles: profileReducers,
	content: contentReducers,
	feed: feedReducers
})
