import React, { useEffect, useState } from 'react'
import { Navigate } from 'react-router-dom'
import PropTypes from 'prop-types'

import api from '../util/api.js'
import { Input } from '../components/UI/index.js'
import { isHydrated } from '../context/Hydration.js'

const AuthForm = ({
	buttonText,
	handleResult,
	redirect,
	redirectUrl,
	inputs,
	apiUrl
}) => {
	const hydrated = isHydrated()
	
	const [formData, setFormData] = useState({})
	// All required inputs must be valid to enable submit button
	const [validInputs, setValidInputs] = useState({})
	
	//const [inputs, setInputs] = useState({})
	
	const [canRedirect, setCanRedirect] = useState(false)
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
		inputs.map(input => {
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
		if (canSubmit) {
			api.call({
				method: 'post',
				url: apiUrl,
				data: {
					...formData
				}
			})
				.then(data => {
					if (!hydrated) return
					if (handleResult) handleResult(true, data)
					
					setCanRedirect(true)
				})
				.catch(error => {
					if (hydrated) {
						if (handleResult) handleResult(false)
						
						setCanRedirect(false)
					}
					
					setAuthMessage(error)
					setCanSubmit(false)
					
					// Clear the password field
					if (formData.password) setFormData({
						...formData,
						password: ''
					})
				})
		}
	}}>
		{canRedirect && redirect ? <Navigate to={redirectUrl} /> : null}
		<div className="auth-error error">{authMessage}</div>
		
		{inputs.map(input => <Input {...input}
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
			{buttonText}
		</button>
	</form>
}

AuthForm.propTypes = {
	buttonText: PropTypes.string,
	handleResult: PropTypes.func,
	redirect: PropTypes.bool,
	redirectUrl: PropTypes.string,
	inputs: PropTypes.array.isRequired,
	apiUrl: PropTypes.string.isRequired
}

AuthForm.defaultProps = {
	buttonText: 'SUBMIT',
	redirect: false,
	redirectUrl: '/'
}

export default AuthForm