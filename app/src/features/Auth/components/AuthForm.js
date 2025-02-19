import React, { useEffect, useRef, useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import PropTypes from 'prop-types'

import api from '../../../util/api.js'
import { Input } from '../../../components/UI.js'
import { isHydrated } from '../../Core/context/Hydration.js'

const AuthForm = ({
	buttonText,
	handleResult,
	redirect,
	redirectUrl,
	inputs,
	apiUrl
}) => {
	const hydrated = isHydrated()

	const navigate = useNavigate()
	const [inputData, setFormData] = useState({})
	const inputRefs = useRef({})

	const [saveReady, setSaveReady] = useState(false)
	const [validInputs, setValidInputs] = useState({})

	const [canRedirect, setCanRedirect] = useState(false)
	const [authMessage, setAuthMessage] = useState('')

	useEffect(() => {
		let allInputsValid = true

		for (let val in validInputs) {
			if (validInputs[val] !== true) {
				allInputsValid = false
				break
			}
		}

		setSaveReady(allInputsValid)
	}, [validInputs, inputData])

	useEffect(() => {
		setFormData(inputs.reduce((result, input) => {
			return {
				...result,
				[input.name]: ''
			}
		}, {}))
		setValidInputs(inputs.reduce((result, input) => {
			return {
				...result,
				[input.name]: input.optional || false
			}
		}, {}))
	}, [])

	return <form onSubmit={(event) => {
		event.preventDefault()

		if (!saveReady) return

		api.call({
			method: 'post',
			url: apiUrl,
			data: {
				...inputData
			}
		})
			.then((data) => {
				if (!hydrated) return
				if (handleResult) handleResult(true, data)

				setCanRedirect(true)
			})
			.catch((error) => {
				if (hydrated) {
					if (handleResult) handleResult(false)

					navigate(redirectUrl)
					//setCanRedirect(false)
				}

				setAuthMessage(error)

				// Clear the password field
				setFormData((prevState) => ({
					...prevState,
					password: ''
				}))
			})
	}}>
		{canRedirect && redirect ? <Navigate to={redirectUrl} /> : null}
		<div className="auth-error error">{authMessage}</div>

		{inputs.map((input) => <Input
			{...input}
			key={input.name}
			ref={(ref) => {
				inputRefs.current[input.name] = ref
			}}
			inlineLabel={true}
			handleValueChange={(value) => setFormData((prevState) => ({
				...prevState,
				// Update form data as the user is making changes
				[input.name]: value
			}))}
			handleValidity={(value) => setValidInputs((prevState) => ({
				...prevState,
				[input.name]: value
			}))}
		/>)}

		<button
			className="btn-full-width btn-round btn-primary"
			type="submit"
			disabled={!saveReady}
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
