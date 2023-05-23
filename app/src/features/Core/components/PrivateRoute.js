import React from 'react'
import { Navigate, Outlet } from 'react-router-dom'

import { isHydrated } from '../../Core/context/Hydration.js'
import { useAuthenticated } from '../../Auth/context/Auth.js'

const PrivateRoute = ({ redirectTo, requireAuth, requireNoAuth }) => {
	const hydrated = isHydrated()
	const { loggedIn } = useAuthenticated()
	
	const canRenderCheck = () => (
		(requireAuth && loggedIn) || (requireNoAuth && !loggedIn) || !hydrated
	)
	
	return canRenderCheck() ? <Outlet /> : <Navigate to={redirectTo} />
}

export default PrivateRoute