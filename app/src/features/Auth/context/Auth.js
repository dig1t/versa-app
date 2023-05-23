import React, { createContext, useContext, useEffect, useState } from 'react'
import { useSelector } from 'react-redux'

export const AuthContext = createContext({
	loggedIn: null,
	userId: null
})

export const useAuthenticated = () => useContext(AuthContext)

export const AuthProvider = ({ children }) => {
	const [loggedIn, setLoggedIn] = useState(null)
	const { authenticated, userId, accessToken } = useSelector((state) => ({
		authenticated: state.user.authenticated,
		userId: state.user.userId,
		accessToken: state.user.accessToken
	}))
	
	useEffect(() => {
		const credentials = userId !== null && accessToken !== null
		
		if ((credentials && authenticated) || authenticated === false) {
			setLoggedIn(authenticated)
		}
	}, [userId, accessToken, authenticated])
	
	return <AuthContext.Provider value={{ loggedIn, userId }}>
		{ children }
	</AuthContext.Provider>
}