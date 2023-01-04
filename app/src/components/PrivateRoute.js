import React, { useEffect } from 'react'
import { Navigate, Outlet } from 'react-router-dom'

import { isHydrated } from '../context/Hydration'
import { isAuthenticated } from '../context/Auth'

const PrivateRoute = props => {
	const hydrated = isHydrated()
	const { loggedIn } = isAuthenticated()
	
	const { redirectTo, requireAuth, requireNoAuth } = props
	
	const canRenderCheck = () => (
		(requireAuth && loggedIn) || (requireNoAuth && !loggedIn) || !hydrated
	)
	
	useEffect(() => console.log('route rendered'), [])
	
	//return renderedComponent
	return canRenderCheck() ? <Outlet /> : <Navigate to={redirectTo} />
}

export default PrivateRoute