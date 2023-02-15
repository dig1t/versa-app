import React, { createContext, useContext, useEffect, useState } from 'react'
import { useSelector } from 'react-redux'

export const AuthContext = createContext({
	loggedIn: null,
	userId: null
})

export const isAuthenticated = () => useContext(AuthContext)

export const AuthProvider = ({ children }) => {
	const [loggedIn, setLoggedIn] = useState(null)
	const { userId, accessToken } = useSelector(state => ({
		userId: state.user.userId,
		accessToken: state.user.accessToken
	}))
	
	useEffect(() => {
		const isLoggedIn = userId !== null && accessToken !== null
		
		if (isLoggedIn) setLoggedIn(isLoggedIn)
	}, [userId, accessToken])
	
	return <AuthContext.Provider value={{ loggedIn, userId }}>
		{ children }
	</AuthContext.Provider>
}