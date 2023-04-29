import { configureStore } from '@reduxjs/toolkit'
import thunk from 'redux-thunk'

import reducer from './reducers/index.js'
import { apiReduxMiddleware } from './util/api.js'

const logger = (store) => (next) => (action) => {
	if (typeof window === 'undefined') return next(action)
	
	console.group(action.type)
	console.log('prev state', store.getState())
	
	const result = next(action)
	
	console.info('dispatching', action)
	console.log('next state', store.getState())
	console.groupEnd(action.type)
	
	return result
}

export const createStore = (preloadedState) => configureStore({
	reducer,
	middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(
		thunk,
		apiReduxMiddleware,
		//logger
	),
	devTools: true,
	preloadedState
})