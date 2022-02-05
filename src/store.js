import { createStore, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'

import reducers from './reducers'

const logger = store => next => action => {
	if (typeof window === 'undefined') return next(action)
	
	console.group(action.type)
	console.log('prev state', store.getState())
	
	const result = next(action)
	
	console.info('dispatching', action)
	console.log('next state', store.getState())
	console.groupEnd(action.type)
	
	return result
}

export const configureStore = initialState => {
	const store = createStore(
		reducers,
		initialState,
		applyMiddleware(thunk, logger)
	)
	
	return store
}