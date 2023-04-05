import React, { useEffect } from 'react'
import { Navigate, Outlet } from 'react-router-dom'

import { isHydrated } from '../context/Hydration.js'
import { useAuthenticated } from '../context/Auth.js'

const PrivateRoute = props => {
	const hydrated = isHydrated()
	const { loggedIn } = useAuthenticated()
	
	const { redirectTo, requireAuth, requireNoAuth } = props
	
	const canRenderCheck = () => (
		(requireAuth && loggedIn) || (requireNoAuth && !loggedIn) || !hydrated
	)
	
	return canRenderCheck() ? <Outlet /> : <Navigate to={redirectTo} />
}

export default PrivateRoute