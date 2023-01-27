import React, { useState, useCallback, useEffect, useMemo } from 'react'
import classNames from 'classnames'
import PropTypes from 'prop-types'

import { validateText } from '../../util'

/* use Input for easy validation
** boolean optional - by default all inputs are required unless specified as optional
** array options
** > array [value, description] - option
** string validateFor - type of text to validate (util/validateText) */
const Input = props => {
	const [errorText, setErrorText] = useState(null)
	const [value, setValue] = useState('')
	const [isValid, setIsValid] = useState(
		props.optional || (!(
			// Make text and textareas valid temporarily
			// so they appear with no errors initially
			props.type == 'select' || props.type == 'selectButtons'
		) && null)
	)
	const [focused, setFocused] = useState(props.autoFocus)
	
	useEffect(() => props.handleValueChange(value), [value])
	
	useEffect(() => {
		if (typeof props.handleValidity !== 'undefined' && props.optional) {
			// Validate optional inputs
			props.handleValidity(true)
		}
	}, [])
	
	const validate = useCallback(text => {
		if (!text) text = value
		
		let validity = true
		
		if (props.optional || ( // optional and 1+ characters exist
			props.optional === false &&
			text.length >= (props.minLength || 0) &&
			text.length <= (props.maxLength || -Math.max()) &&
			text !== '' // not optional and is in between given min/max length
		)) {
			if (text.length > 0) {
				validity = validateText(text, props.validateFor)
				if (!validity) setErrorText(`${props.validateFor} required`)
			}
		} else {
			validity = false
			
			if (text.length !== 0 && text.length <= (props.minLength - 1 || 0)) setErrorText(
				`${props.validateFor} is too short (${props.minLength} characters)`
			)
			
			if (text.length === 0) setErrorText(`missing ${props.validateFor}`)
			
			if (props.maxLength && text.length >= (props.maxLength + 1 || 0)) setErrorText(
				`${props.validateFor} is too long (${props.maxLength} characters)`
			)
		}
		
		if (validity) setErrorText(null)
		
		if (typeof props.handleValidity !== 'undefined' && validity !== isValid) {
			props.handleValidity(validity)
			setIsValid(validity)
		}
	}, [value])
	
	const handleChange = useCallback(event => {
		setValue(event.target.value)
		validate()
	})
	
	// TODO: Swap this with handleChange?
	const handleKeyDown = useCallback(event => {
		let val = event.target.value
		const keyPressed = event.key
		
		// TODO: Is this still needed?
		if (!event.ctrlKey && !event.altKey && !event.shiftKey) {
			if (keyPressed.length === 1) val += keyPressed
		}
		
		setValue(val)
		validate()
	})
	
	const attributes = {
		placeholder: !props.inlineLabel ? props.placeholder : null,
		name: props.name,
		id: props.name,
		minLength: props.minLength,
		maxLength: props.maxLength,
		autoFocus: props.autoFocus,
		disabled: props.disabled,
		'aria-required': (props.optional && true) || false
	}
	
	const children = useMemo(() => {
		switch(props.type) {
			case 'textarea':
				return <textarea {...attributes}
					onKeyDown={handleKeyDown}
					onInput={handleChange}
					onChange={handleChange}
					onKeyUp={handleChange}
					onFocus={() => setFocused(true)}
					onBlur={() => {
						validate()
						setFocused(false)
					}}
				/>
			case 'select':
				return <select {...attributes} multiple={props.multiple}>
					{props.options.map(option => {
						return <option
							key={option[1]}
							value={option[1]}
							onChange={event => setValue(event.value)}
							defaultValue={props.defaultValue && props.defaultValue === option[1] && props.defaultValue}>
							{option[0]}
						</option>
					})}
				</select>
			case 'selectButtons':
				return <>
					{props.options.map(option => {
						return <label className={classNames(value === option[1] && 'selected')} key={option[1]}>
							<input {...attributes}
								type="radio"
								value={option[1]}
								onChange={event => setValue(event.value)}
								defaultChecked={props.defaultValue && props.defaultValue === option[1] && props.defaultValue}
							/>
							<span>{option[0]}</span>
						</label>
					})}
				</>
			default:
				return <input {...attributes}
					type={props.type}
					className={classNames(!props.inlineLabel && 'input-text')}
					onKeyDown={handleKeyDown}
					onInput={handleChange}
					onChange={handleChange}
					onKeyUp={handleChange}
					onFocus={() => setFocused(true)}
					onBlur={() => {
						validate()
						setFocused(false)
					}}
				/>
		}
	})
	
	const wrapInput = props.type === 'selectButtons' ? true : (props.label || props.wrap)
	
	return <div className={classNames(
		'input', 'input-' + props.type,
		isValid === false && 'error',
		isValid && 'input-ok',
		props.inlineLabel && 'inline-label',
		(focused || value.length > 0) && 'input-focused'
	)}>
		{wrapInput ? <label>
			{props.label && <span>{props.label}</span>}
			{children}
		</label> : children}
		
		{props.displayError && errorText && <div className="error-text">
			{errorText}
		</div>}
	</div>
}

Input.defaultProps = {
	type: 'text',
	minLength: 0,
	optional: false,
	validateFor: 'text',
	wrap: false,
	value: '',
	autoFocus: false,
	displayError: true
}

Input.propTypes = {
	handleValueChange: PropTypes.func.isRequired,
	handleValidity: PropTypes.func,
	type: PropTypes.string,
	minLength: PropTypes.number,
	maxLength: PropTypes.number,
	optional: PropTypes.bool,
	validateFor: PropTypes.string,
	defaultValue: PropTypes.string,
	wrap: PropTypes.bool,
	displayError: PropTypes.bool
}

export default Input