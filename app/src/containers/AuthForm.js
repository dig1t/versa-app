import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { Navigate } from 'react-router-dom'
import PropTypes from 'prop-types'
import axios from 'axios'

import useMounted from '../util/useMounted'
import { Input } from '../components/UI'

import { setAuthStatus, fetchUserData } from '../actions/user'

const AuthForm = props => {
	const dispatch = useDispatch()
	
	const [formData, setFormData] = useState({})
	// All required inputs must be valid to enable submit button
	const [validInputs, setValidInputs] = useState({})
	
	//const [inputs, setInputs] = useState({})
	
	const [redirect, setRedirect] = useState(false)
	const [canSubmit, setCanSubmit] = useState(false)
	const [authMessage, setAuthMessage] = useState('')
	
	const mounted = useMounted()
	
	useEffect(() => {
		let allInputsValid = true
		
		for (let val in validInputs) {
			if (validInputs[val] !== true) {
				allInputsValid = false
				break
			}
		}
		
		setCanSubmit(allInputsValid)
	}, [validInputs])
	
	useEffect(() => {
		console.log(formData)
	}, [formData])
	
	useEffect(() => {
		props.inputProps.map(input => {
			setFormData({
				...formData,
				[input.name]: ''
			})
			setValidInputs({
				...validInputs,
				[input.name]: input.optional || false
			})
		})
	}, [])
	
	return <form onSubmit={event => {
		event.preventDefault()
		
		// Only post if all inputs are valid
		if (canSubmit) axios.post(props.apiUrl, formData)
			.then(response => {
				if (mounted) {
					if (props.callback) props.callback(response.data.success)
					
					setRedirect(response.data.success)
				}
				
				if (response.data.success) {
					// setAuthStatus will re-render the Routes component and PrivateRoute will redirect
					dispatch(setAuthStatus(true))
					dispatch(fetchUserData())
				} else {
					setAuthMessage(response.data.message)
					setCanSubmit(false)
					
					if (formData.password !== 'undefined') setFormData({
						...formData,
						password: ''
					})
				}
			})
			.catch(error => console.error(error))
	}}>
		{redirect && props.redirect ? <Navigate to={props.redirectUrl} /> : null}
		<div className="auth-error error">{authMessage}</div>
		
		{props.inputProps.map(input => <Input {...input}
			key={'auth-form-' + input.name}
			inlineLabel={true}
			value={formData[input.name]}
			handleValueChange={value => {
				setFormData(prev => ({
					...prev,
					// Update form data as the user is making changes
					[input.name]: value
				}))
			}}
			handleValidity={value => setValidInputs({
				...validInputs,
				[input.name]: value
			})}
		/>)}
		
		<button
			className="btn-full-width btn-round btn-primary"
			type="submit"
			disabled={!canSubmit}
		>
			{props.buttonText}
		</button>
	</form>
}

AuthForm.propTypes = {
	inputProps: PropTypes.array.isRequired,
	apiUrl: PropTypes.string.isRequired
}

AuthForm.defaultProps = {
	buttonText: 'SUBMIT',
	redirect: false,
	redirectUrl: '/'
}

export default AuthForm