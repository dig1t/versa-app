import { configureStore } from '@reduxjs/toolkit'
import thunk from 'redux-thunk'
import logger from 'redux-logger'

import reducer from './reducers/index.js'
import { apiReduxMiddleware } from './util/api.js'

export const createStore = preloadedState => configureStore({
	reducer,
	middleware: getDefaultMiddleware => getDefaultMiddleware().concat(
		thunk,
		apiReduxMiddleware,
		//logger
	),
	devTools: true,
	preloadedState
})