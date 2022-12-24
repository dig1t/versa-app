import { configureStore } from '@reduxjs/toolkit'
import thunk from 'redux-thunk'
import logger from 'redux-logger'

import reducer from './reducers'

export const createStore = preloadedState => configureStore({
	reducer,
	middleware: getDefaultMiddleware => getDefaultMiddleware().concat(thunk, logger),
	devTools: process.env.NODE_ENV !== 'production',
	preloadedState
})