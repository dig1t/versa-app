import React, { useEffect } from 'react'
import { useDispatch } from 'react-redux'

import { fetchAccessToken, fetchUserAuth, fetchUserProfile } from '../actions/user.js'
import { AuthProvider, isAuthenticated } from '../context/Auth.js'

import Loading from '../components/Loading.js'

const AsyncAuthFetch = ({ children }) => {
	const dispatch = useDispatch()
	
	const { loggedIn, userId } = isAuthenticated()
	
	useEffect(() => {
		dispatch(fetchUserAuth())
	}, [])
	
	useEffect(() => {
		console.log('logged in?', loggedIn)
		if (loggedIn) {
			dispatch(fetchUserProfile())
			dispatch(fetchAccessToken())
		}
	}, [loggedIn])
	
	return loggedIn === null ? <Loading /> : children
}

export const FetchInitialData = ({ children }) => <AuthProvider>
	<AsyncAuthFetch>{ children }</AsyncAuthFetch>
</AuthProvider>