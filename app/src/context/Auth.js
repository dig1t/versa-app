import React, { createContext, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchUserAuth } from '../actions/user.js'

export const AuthContext = createContext({ state: null })

export const AuthContextProvider = ({ children }) => {
	const dispatch = useDispatch()
	const loggedIn = useSelector((state) => state.user.loggedIn)
	const [state, setState] = useState(null)
	
	useEffect(() => {
		console.log('AUTH STATE CHANGED TO', loggedIn)
		setState(loggedIn)
	}, [loggedIn])
	
	useEffect(() => dispatch(fetchUserAuth()), [])
	
	return <AuthContext.Provider value={{ state }}>{ children }</AuthContext.Provider>
}