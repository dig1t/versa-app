import React, { useEffect, useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'

import useMounted from '../util/useMounted'
import { useSelector } from 'react-redux'

const PrivateRoute = props => {
	const loggedIn = useSelector((state) => state.user.loggedIn)
	
	const { redirectTo, requireAuth, requireNoAuth } = props
	
	const canRenderCheck = () => loggedIn === null || (
		(requireAuth && loggedIn) || (requireNoAuth && !loggedIn)
	)
	
	const [canRender, setCanRender] = useState(canRenderCheck())
	
	const navigate = useNavigate()
	const mounted = useMounted()
	
	// Only redirect on the client
	useEffect(() => {
		mounted.current && !canRender && navigate(redirectTo)
		
		setCanRender(canRenderCheck())
	}, [loggedIn])
	
	return canRenderCheck() ? props.children : <Navigate to={redirectTo} replace={true} />
}

export default PrivateRoute