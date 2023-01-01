import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Provider } from 'react-redux'

import { createStore } from '../store'

import AppRoutes from './Routes'
import Html from './Html'

import { fetchUserData } from '../actions/user'
//import { setAuthStatus } from './actions/user'

const store = createStore()

const fetchInitialData = () => {
	const dispatch = useDispatch()
	const user = useSelector(state => state.user)
	
	useEffect(() => {
		user.loggedIn && user.profile && user.profile.userId && dispatch(fetchUserData())
	}, [user])
	
	/*	const userId = req.user && req.user.userId
	
	serverStore.dispatch(setAuthStatus(typeof userId !== 'undefined'))*/
}

const App = props => {
	fetchInitialData()
	
	return <Html assets={props.assets} title={props.title}>
			<Provider store={store}>
				<AppRoutes />
			</Provider>
	</Html>
}

export default App