import React, { useState, useCallback, useEffect, useMemo, forwardRef, useImperativeHandle, useRef } from 'react'
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

const LabelComponent = props => <label {...props} />

const TextInput = forwardRef((props, ref) => {
	return <input
		{...props.attributes}
		ref={ref}
		type={props.type}
		className={classNames(!props.inlineLabel && 'input-text')}
		onKeyDown={props.handleKeyDown}
		onInput={props.handleChange}
		onChange={props.handleChange}
		onKeyUp={props.handleChange}
		onFocus={() => props.setFocused(true)}
		onBlur={() => {
			props.validate()
			props.setFocused(false)
		}}
		value={props.value}
	/>
})

const TextAreaInput = forwardRef((props, ref) => {
	return <textarea
		{...props.attributes}
		ref={ref}
		onKeyDown={props.handleKeyDown}
		//onInput={props.handleChange}
		onChange={props.handleChange}
		//onKeyUp={props.handleChange}
		onFocus={() => props.setFocused(true)}
		onBlur={() => {
			props.validate()
			props.setFocused(false)
		}}
		value={props.value}
	/>
})

const CheckboxInput = forwardRef((props, ref) => {
	return <>
		{props.componentOptions.checkboxes.map(option => <label
			className={classNames(
				props.value === option[1] && 'selected',
				`input-checkbox-${props.checkboxStyle}`
			)}
			key={option[1]}
		>
			<input {...props.attributes}
				type="checkbox"
				value={option[1]}
				onChange={event => props.setValue({
					...props.value,
					[option[1]]: event.target.checked
				})}
				checked={props.visibleValue[option[1]] === true}
				defaultChecked={props.defaultValue && props.defaultValue === option[1] && props.defaultValue}
			/>
			<span>{option[0]}</span>
		</label>)}
	</>
})

const SelectButtonsInput = forwardRef((props, ref) => {
	return <>
		{props.componentOptions.buttons.map(option => <label
			className={classNames(props.value === option[1] && 'selected')}
			key={option[1]}
		>
			<input {...props.attributes}
				type="radio"
				value={option[1]}
				onChange={props.handleChange}
				checked={props.value === option[1]}
				defaultChecked={props.defaultValue && props.defaultValue === option[1] && props.defaultValue}
			/>
			<span>{option[0]}</span>
		</label>)}
	</>
})

const SelectInput = forwardRef((props, ref) => {
	return <select
		{...props.attributes}
		ref={ref}
		multiple={props.componentOptions.multiple}
		value={props.value}
		onChange={event => props.setValue(
			[...event.target.selectedOptions].map(option => {
				return option.value
			})
		)}
	>
		{props.componentOptions.buttons.map(option => <option
			key={option[1]}
			value={option[1]}
		>
			{option[0]}
		</option>)}
	</select>
})

const componentMap = {
	text: TextInput,
	textarea: TextAreaInput,
	checkbox: CheckboxInput,
	checkboxes: CheckboxInput,
	selectButtons: SelectButtonsInput,
	select: SelectInput
}

/* use Input for easy validation
** boolean optional - by default all inputs are required unless specified as optional
** array options
** > array [value, description] - option
** string validateFor - type of text to validate (util/validateText) */
const Input = forwardRef((props, ref) => {
	const [errorText, setErrorText] = useState(null)
	const [value, setValue] = useState(
		props.type === 'checkboxes' ? optionsToObject(props.options) : ''
	)
	const [isValid, setIsValid] = useState(props.optional || (!(
		// Make text and textareas valid temporarily
		// so they appear with no errors initially
		props.type == 'select' || props.type == 'selectButtons'
	) && null))
	const [focused, setFocused] = useState(props.autoFocus)
	const inputRef = useRef()
	
	useImperativeHandle(ref, () => ({
		setValue: newValue => {
			inputRef.current.value = newValue
			setValue(newValue)
		},
		
		getValue: () => {
			return inputRef.current.value
		}
	}))
	
	useEffect(() => {
		props.handleValueChange(value)
		validate(value)
	}, [value])
	
	useEffect(() => props.handleValidity(isValid), [isValid])
	
	useEffect(() => {
		if (props.type === undefined) return
		
		switch(props.type) {
			case 'text': case 'textarea': case 'selectButtons': {
				if (typeof props.value !== 'string') return
				
				inputRef.current.value = props.value
				
				break
			}
			case 'checkboxes': {
				if (haveSameKeys(props.value, optionsToObject(props.options))) return
				
				setValue(optionsToObject(props.options))
				
				break
			}
			case 'select': {
				if (!(props.value instanceof Array)) {
					inputRef.current.value = props.value instanceof Array ? props.array : []
				} else {
					inputRef.current.value = props.value
				}
				
				break
			}
		}
		
		validate(props.value)
	}, [props.value])
	
	useEffect(() => {
		if (typeof props.handleValidity !== 'undefined' && props.optional) {
			// Validate optional inputs
			props.handleValidity(true)
		}
	}, [])
	
	const validate = useCallback(newValue => {
		if (typeof newValue === 'undefined') newValue = inputRef.current.value
		
		let validity = true
		
		switch(props.type) {
			case 'text': case 'textarea': {
				if (props.optional || ( // optional and 1+ characters exist
					props.optional === false &&
					newValue.length >= props.minLength &&
					newValue.length <= (props.maxLength || -Math.max()) &&
					newValue !== '' // not optional and is in between given min/max length
				)) {
					if (newValue.length > 0) {
						validity = validateText(newValue, props.validateFor)
						
						if (validity === false) setErrorText(
							`${props.label || props.validateFor} is not a valid ${props.validateFor}`
						)
					}
				} else {
					validity = false
					
					if (newValue.length !== 0 && newValue.length <= (props.minLength - 1 || 0)) setErrorText(
						`${props.validateFor} is too short (${props.minLength} characters)`
					)
					
					if (newValue.length === 0) setErrorText(`Missing ${props.label || props.validateFor}`)
					
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
		
		setIsValid(validity)
	}, [value, props.value, props.type])
	
	const handleChange = () => {
		setValue(inputRef.current.value)
	}
	
	// TODO: Swap this with handleChange?
	const handleKeyDown = () => {
		setValue(inputRef.current.value)
	}
	
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
	
	const wrapInput = props.type === 'selectButtons' ? true : (props.label || props.wrap)
	const InputComponent = componentMap[props.type] || componentMap.text
	const WrapComponent = wrapInput ? LabelComponent : React.Fragment
	
	return <div className={classNames(
		'input', 'input-' + props.type,
		isValid === false && props.showStatusColors && 'error',
		isValid && props.showStatusColors && 'input-ok',
		props.inlineLabel && 'inline-label',
		focused && 'input-focused'
	)}>
		<WrapComponent>
			{props.label && <span>{props.label}</span>}
			<InputComponent
				ref={inputRef}
				attributes={attributes}
				componentOptions={props.options}
				visibleValue={value}
				defaultValue={props.defaultValue}
				setFocused={setFocused}
				setValue={setValue}
				validate={validate}
				handleChange={handleChange}
				onKeyDown={handleKeyDown}
			/>
		</WrapComponent>
		
		{props.displayError && errorText && <div className="error-text">
			{errorText}
		</div>}
	</div>
})

Input.defaultProps = {
	type: 'text',
	minLength: 0,
	optional: false,
	validateFor: 'text',
	wrap: false,
	value: '',
	autoFocus: false,
	displayError: true,
	showStatusColors: true,
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