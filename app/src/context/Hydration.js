import React, { createContext, useContext, useEffect, useState } from 'react'

export const HydrationContext = createContext({ hydrated: false })

export const isHydrated = () => useContext(HydrationContext)

export const HydrationProvider = ({ children }) => {
	const [hydrated, setHydrated] = useState(false)
	
	useEffect(() => setHydrated(true), [])
	
	return <HydrationContext.Provider value={hydrated}>{ children }</HydrationContext.Provider>
}