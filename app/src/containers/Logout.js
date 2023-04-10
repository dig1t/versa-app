import React, { useState } from 'react'
import { useDispatch } from 'react-redux'

import { userLogout } from '../actions/user.js'

const Logout = () => {
	const dispatch = useDispatch()
	
	const [clicked, setClicked] = useState(false)
	
	const handleClick = event => {
		event.preventDefault()
		
		!clicked && dispatch(userLogout(true))
		
		setClicked(true)
	}
	
	return <a href="/logout" onClick={handleClick}>Logout</a>
}

export default Logout