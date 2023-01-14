import React, { useEffect } from 'react'
import { useDispatch } from 'react-redux'

import { fetchUserAuth, fetchUserProfile } from '../actions/user'
import { AuthProvider, isAuthenticated } from '../context/Auth'

import Loading from '../components/Loading'

const AsyncAuthFetch = ({ children }) => {
	const dispatch = useDispatch()
	
	const { loggedIn, userId } = isAuthenticated()
	
	useEffect(() => {
		dispatch(fetchUserAuth())
	}, [])
	
	useEffect(() => {
		if (loggedIn) dispatch(fetchUserProfile())
	}, [loggedIn])
	
	return loggedIn === null ? <Loading /> : children
}

export const FetchInitialData = ({ children }) => <AuthProvider>
	<AsyncAuthFetch>{ children }</AsyncAuthFetch>
</AuthProvider>