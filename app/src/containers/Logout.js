import React, { useState } from 'react'
import { useDispatch } from 'react-redux'

import { USER_LOGOUT_SUCCESS } from '../constants/actionTypes.js'
import { apiCall } from '../util/api'

const Logout = () => {
	const dispatch = useDispatch()
	
	const [clicked, setClicked] = useState(false)
	
	const handleClick = event => {
		event.preventDefault()
		
		!clicked && apiCall({
			method: 'post',
			url: '/auth/logout'
		})
			.then(() => dispatch({
				type: USER_LOGOUT_SUCCESS
			}))
		
		setClicked(true)
	}
	
	return <a href="/logout" onClick={handleClick}>Logout</a>
}

export default Logout