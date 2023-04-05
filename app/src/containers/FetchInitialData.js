import React, { useEffect } from 'react'
import { useDispatch } from 'react-redux'

import { fetchUserAuth, fetchUserProfile, fetchUserSettings } from '../actions/user.js'
import { AuthProvider, useAuthenticated } from '../context/Auth.js'

import Loading from '../components/Loading.js'

const AsyncAuthFetch = ({ children }) => {
	const dispatch = useDispatch()
	
	const { loggedIn } = useAuthenticated()
	
	useEffect(() => {
		dispatch(fetchUserAuth())
	}, [])
	
	useEffect(() => {
		if (loggedIn) {
			dispatch(fetchUserProfile())
			dispatch(fetchUserSettings())
		}
	}, [loggedIn])
	
	return loggedIn === null ? <Loading /> : children
}

export const FetchInitialData = ({ children }) => <AuthProvider>
	<AsyncAuthFetch>{ children }</AsyncAuthFetch>
</AuthProvider>