import React, { useState } from 'react'
import { useDispatch } from 'react-redux'

import { userLogout } from '../actions/user.js'
import api from '../util/api.js'

const Logout = () => {
	const dispatch = useDispatch()
	
	const [clicked, setClicked] = useState(false)
	
	const handleClick = event => {
		event.preventDefault()
		
		!clicked && api.call({
			method: 'post',
			url: '/auth/logout'
		})
			.then(() => {
				try {
					localStorage.clear()
				} catch(error) {
					console.error('Could not clear cookies', error)
				}
				
				dispatch(userLogout())
			})
		
		setClicked(true)
	}
	
	return <a href="/logout" onClick={handleClick}>Logout</a>
}

export default Logout