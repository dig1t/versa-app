/* eslint-disable no-undef */
import React, { useEffect, useRef, useState } from 'react'
import ReactDOM from 'react-dom'

const getDOMRoot = () => {
	const res = document.getElementById('ui-root')
	
	if (res) return res
	
	const root = document.createElement('div')
	root.setAttribute('id', 'ui-root')
	document.body.appendChild(root)
	
	return root
}

const Portal = ({ children }) => {
	const root = useRef()
	const [mounted, setMounted] = useState(false)
	
	useEffect(() => {
		// Mounted
		root.current = getDOMRoot()
		setMounted(true)
	}, [])
	
	return mounted ? ReactDOM.createPortal(
		children,
		root.current
	) : <></>
}

export default Portal