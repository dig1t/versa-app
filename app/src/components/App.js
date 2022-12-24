import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import AppRoutes from './Routes'
import Html from './Html'

import { fetchUserData } from '../actions/user'

const App = props => {
	const dispatch = useDispatch()
	const user = useSelector(state => state.user)
	
	useEffect(() => {
		user.loggedIn && user.profile && user.profile.userId && dispatch(fetchUserData())
	}, [user])
	
	return <Html assets={props.assets} title={props.title}>
		<AppRoutes />
	</Html>
}

export default App