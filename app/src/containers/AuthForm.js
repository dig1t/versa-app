import React, { useEffect, useState } from 'react'
import { Navigate } from 'react-router-dom'
import PropTypes from 'prop-types'

import { Input } from '../components/UI/index.js'
import { apiCall } from '../util/api.js'
import { isHydrated } from '../context/Hydration.js'

const AuthForm = props => {
	const hydrated = isHydrated()
	
	const [formData, setFormData] = useState({})
	// All required inputs must be valid to enable submit button
	const [validInputs, setValidInputs] = useState({})
	
	//const [inputs, setInputs] = useState({})
	
	const [redirect, setRedirect] = useState(false)
	const [canSubmit, setCanSubmit] = useState(false)
	const [authMessage, setAuthMessage] = useState('')
	
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
		if (canSubmit) apiCall({
			method: 'post',
			url: props.apiUrl,
			data: formData
		})
			.then(data => {
				if (hydrated) {
					if (props.handleResult) props.handleResult(true, data)
					
					setRedirect(true)
				}
			})
			.catch(error => {
				if (hydrated) {
					if (props.handleResult) props.handleResult(false)
					
					setRedirect(false)
				}
				
				setAuthMessage(error)
				setCanSubmit(false)
				
				// Clear the password field
				if (formData.password) setFormData({
					...formData,
					password: ''
				})
			})
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