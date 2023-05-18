import React from 'react'
import { useNavigate } from 'react-router-dom'
import { Icon } from '../components/UI.js'

export default () => {
	const navigate = useNavigate()
	
	return <div onClick={() => navigate(-1)}>
		<Icon icon='back' />
	</div>
}