import React from 'react'
import { useSelector } from 'react-redux'
import { Navigate } from 'react-router-dom'

const PrivateRoute = props => {
	const loggedIn = useSelector((state) => state.user.loggedIn)
	
	const { redirectTo, requireAuth, requireNoAuth } = props
	const canRender = (requireAuth && loggedIn) || (requireNoAuth && !loggedIn)
	
	return canRender ? props.children : <Navigate to={redirectTo} />
}

export default PrivateRoute