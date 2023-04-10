import React, { useState, useCallback, useEffect, useMemo } from 'react'
import classNames from 'classnames'
import PropTypes from 'prop-types'

import { validateText } from '../../util/index.js'

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const optionsToObject = options => options.reduce((result, [label, value]) => {
	return {
		...result,
		[value]: false
	}
}, {})

const haveSameKeys = (obj1, obj2) =>
	Object.keys(obj1).length === Object.keys(obj2).length &&
	// eslint-disable-next-line no-prototype-builtins
	Object.keys(obj1).every(key => obj2.hasOwnProperty(key))

/* use Input for easy validation
** boolean optional - by default all inputs are required unless specified as optional
** array options
** > array [value, description] - option
** string validateFor - type of text to validate (util/validateText) */
const Input = props => {
	const [errorText, setErrorText] = useState(null)
	const [value, setValue] = useState(
		props.type === 'checkboxes' ? optionsToObject(props.options) : ''
	)
	const [visibleValue, setVisibleValue] = useState('')
	const [isValid, setIsValid] = useState(props.optional || (!(
		// Make text and textareas valid temporarily
		// so they appear with no errors initially
		props.type == 'select' || props.type == 'selectButtons'
	) && null))
	const [focused, setFocused] = useState(props.autoFocus)
	
	useEffect(() => props.handleValueChange(value), [value])
	
	useEffect(() => {
		switch(props.type) {
			case 'text': case 'textarea': case 'selectButtons': {
				if (typeof props.value !== 'string') return
				
				setValue(props.value)
				
				break
			}
			case 'checkboxes': {
				if (haveSameKeys(props.value, optionsToObject(props.options))) return
				
				setValue(optionsToObject(props.options))
				
				break
			}
			case 'select': {
				if (!(props.value instanceof Array)) {
					setValue(props.value instanceof Array ? props.array : [])
				} else {
					setValue(props.value)
				}
				
				break
			}
		}
		
		setVisibleValue(props.value)
		validate(props.value)
	}, [props.value])
	
	useEffect(() => {
		if (typeof props.handleValidity !== 'undefined' && props.optional) {
			// Validate optional inputs
			props.handleValidity(true)
		}
	}, [])
	
	const validate = useCallback(newValue => {
		if (typeof newValue === 'undefined') newValue = value
		
		let validity = true
		
		switch(props.type) {
			case 'text': case 'textarea': {
				if (props.optional || ( // optional and 1+ characters exist
					props.optional === false &&
					newValue.length >= (props.minLength || 0) &&
					newValue.length <= (props.maxLength || -Math.max()) &&
					newValue !== '' // not optional and is in between given min/max length
				)) {
					if (newValue.length > 0) {
						validity = validateText(newValue, props.validateFor)
						
						if (!validity) setErrorText(`${props.validateFor} required`)
					}
				} else {
					validity = false
					
					if (newValue.length !== 0 && newValue.length <= (props.minLength - 1 || 0)) setErrorText(
						`${props.validateFor} is too short (${props.minLength} characters)`
					)
					
					if (newValue.length === 0) setErrorText(`missing ${props.validateFor}`)
					
					if (props.maxLength && newValue.length >= (props.maxLength + 1 || 0)) setErrorText(
						`${props.validateFor} is too long (${props.maxLength} characters)`
					)
				}
				
				break
			}
			case 'select': {
				newValue.map(newOption => {
					const optionExists = props.options.find(option => option[1] === newOption)
					
					// Make sure user didn't manually change the value
					if (!optionExists) {
						validity = false
					}
				})
				
				break
			}
			case 'selectButtons': {
				const optionExists = props.options.find(option => option[1] === newValue)
				
				// Make sure user didn't manually change the value
				if (!optionExists) {
					validity = false
				}
				
				break
			}
			case 'checkboxes': {
				// TODO
				
				break
			}
		}
		
		if (validity) setErrorText(null)
		
		if (typeof props.handleValidity !== 'undefined' && validity !== isValid) {
			props.handleValidity(validity)
			setIsValid(validity)
		}
	}, [value, props.value, props.type])
	
	const handleChange = event => {
		setValue(event.target.value)
		setVisibleValue(event.target.value)
		validate()
	}
	
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
	}, [])
	
	const attributes = useMemo(() => ({
		...props.attributes,
		placeholder: !props.inlineLabel ? props.placeholder : null,
		name: props.name,
		id: props.name,
		minLength: props.minLength,
		maxLength: props.maxLength,
		autoFocus: props.autoFocus,
		disabled: props.disabled,
		'aria-required': (props.optional && true) || false
	}), [props])
	
	const children = useMemo(() => {
		switch(props.type) {
			case 'textarea': {
				return <textarea {...attributes}
					onKeyDown={handleKeyDown}
					onInput={handleChange}
					onChange={handleChange}
					//onKeyUp={handleChange}
					onFocus={() => setFocused(true)}
					onBlur={() => {
						validate()
						setFocused(false)
					}}
					value={visibleValue}
				/>
			}
			case 'select': { // [Label, Value]
				return <select
					{...attributes}
					multiple={props.multiple}
					value={value}
					onChange={event => {
						setValue(
							[...event.target.selectedOptions].map(option => {
								return option.value
							})
						)
						validate()
					}}
				>
					{props.options.map(option => <option
						key={option[1]}
						value={option[1]}
					>
						{option[0]}
					</option>)}
				</select>
			}
			case 'selectButtons': { // [Label, Value]
				return <>
					{props.options.map(option => <label
						className={classNames(value === option[1] && 'selected')}
						key={option[1]}
					>
						<input {...attributes}
							type="radio"
							value={option[1]}
							onChange={handleChange}
							checked={value === option[1]}
							defaultChecked={props.defaultValue && props.defaultValue === option[1] && props.defaultValue}
						/>
						<span>{option[0]}</span>
					</label>)}
				</>
			}
			case 'checkboxes': {
				return <>
					{props.options.map(option => <label
						className={classNames(
							value === option[1] && 'selected',
							`input-checkbox-${props.checkboxStyle}`
						)}
						key={option[1]}
					>
						<input {...attributes}
							type="checkbox"
							value={option[1]}
							onChange={event => {
								setValue({
									...value,
									[option[1]]: event.target.checked
								})
								validate()
							}}
							checked={value[option[1]] === true}
							defaultChecked={props.defaultValue && props.defaultValue === option[1] && props.defaultValue}
						/>
						<span>{option[0]}</span>
					</label>)}
				</>
			}
			default: {
				return <input
					{...attributes}
					type={props.type}
					className={classNames(!props.inlineLabel && 'input-text')}
					onKeyDown={handleKeyDown}
					onInput={handleChange}
					onChange={handleChange}
					//onKeyUp={handleChange}
					onFocus={() => setFocused(true)}
					onBlur={() => {
						validate()
						setFocused(false)
					}}
					value={visibleValue}
				/>
			}
		}
	}, [props])
	
	const wrapInput = props.type === 'selectButtons' ? true : (props.label || props.wrap)
	
	return <div className={classNames(
		'input', 'input-' + props.type,
		isValid === false && 'error',
		isValid && 'input-ok',
		props.inlineLabel && 'inline-label',
		focused && 'input-focused'
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
	displayError: true,
	checkboxStyle: 'box' // box or slider
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
	displayError: PropTypes.bool,
	checkboxStyle: PropTypes.string
}

export default Input