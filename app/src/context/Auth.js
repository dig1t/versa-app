import React, { createContext, useContext } from 'react'
import { useSelector } from 'react-redux'

export const AuthContext = createContext({ loggedIn: null, userId: null })

export const isAuthenticated = () => useContext(AuthContext)

export const AuthProvider = ({ children }) => {
	const { loggedIn, userId } = useSelector(state => ({
		loggedIn: state.user.loggedIn,
		userId: state.user.userId
	}))
	
	return <AuthContext.Provider value={{ loggedIn, userId }}>
		{ children }
	</AuthContext.Provider>
}