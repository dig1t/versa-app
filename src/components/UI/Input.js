import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import { validateText } from '../../util'

/* use Input for easy validation
** boolean optional - by default all inputs are required unless specified as optional
** array options
** > array [value, description] - option
** string validateFor - type of text to validate (util/validateText) */
class Input extends React.Component {
	constructor(props) {
		super(props)
		
		this.state = {
			canWrap: props.type === 'selectButtons' ? true : props.wrap,
			value: props.value,
			isValid: null,
			errorText: null
		}
		
		this.validate = this.validate.bind(this)
	}
	
	validate = value => {
		if (!value) value = this.props.value
		
		let isValid = true
		
		if (this.props.optional || ( // optional and 1+ characters exist
			this.props.optional === false &&
			value.length >= (this.props.minLength || 0) &&
			value.length <= (this.props.maxLength || -Math.max()) &&
			value !== '' // not optional and is in between given min/max length
		)) {
			if (value.length > 0) {
				isValid = validateText(value, this.props.validateFor)
				
				if (!isValid) this.setState({ errorText: `Invalid input` })
			}
		} else {
			isValid = false
			if (value.length !== 0 && value.length <= (this.props.minLength - 1 || 0)) this.setState({
				errorText: `${this.props.validateFor} is too short (${this.props.minLength} characters)`
			})
			
			if (value.length === 0) this.setState({ errorText: `Missing input` })
			
			if (this.props.maxLength && value.length >= (this.props.maxLength + 1 || 0)) this.setState({
				errorText: `${this.props.validateFor} is too long (${this.props.maxLength} characters)`
			})
		}
		
		// if not valid then toggle error
		if (this.state.isValid !== isValid) {
			this.props.handleValidity(this.props.name, isValid)
			this.setState({ isValid })
		}
	}
	
	handleKeyDown = event => {
		let val = this.props.value
		const keyPressed = String.fromCharCode(event.which)
		
		// set as empty string if pressed backspace with 1 character in value
		if (event.keyCode === 8) {
			val = val.slice(0, -1)
		} else if (!event.ctrlKey && !event.altKey && !event.shiftKey) {
			if (keyPressed.length === 1) val += keyPressed
		}
	}
	
	handleKeyUp = event => {
		// if ctrl + v or backspace then re-validate
		this.validate()
		//if ((event.ctrlKey && event.keyCode === 86) || event.keyCode === 8) this.validate()
	}
	
	componentWillReceiveProps(nextProps) {
		// if (this.state.value !== nextProps.value) this.setState({ value: nextProps.value })
		if (this.state.value !== nextProps.value) this.validate(nextProps.value)
	}
	
	el(isInvalid) {
		const attributes = {
			className: classNames(!this.state.canWrap && isInvalid && 'error'),
			placeholder: this.props.placeholder,
			name: this.props.name,
			onChange: this.props.onChange,
			minLength: this.props.minLength,
			maxLength: this.props.maxLength,
			autoFocus: this.props.autoFocus,
			disabled: this.props.disabled,
			'aria-required': (this.props.optional && true) || false
		}
		
		switch(this.props.type) {
			case 'textarea':
				return <textarea {...attributes}
					onBlur={() => this.validate()}
					onKeyDown={this.handleKeyDown}
					onKeyUp={this.handleKeyUp}
					value={this.props.value}
				></textarea>
			case 'select':
				return <select {...attributes} multiple={this.props.multiple}>
					{this.props.options.map(option => {
						return <option
							key={option[1]}
							value={option[1]}
							defaultValue={this.props.defaultValue && this.props.defaultValue === option[1] && this.props.defaultValue}>
							{option[0]}
						</option>
					})}
				</select>
			case 'selectButtons':
				return <>
					{this.props.options.map(option => {
						const className = classNames(this.props.value === option[1] && 'selected')
						const labelClassName = className.length > 0 ? { className } : {}
						
						return <label {...labelClassName} key={option[1]}>
							<input {...attributes}
							type="radio"
							value={option[1]}
							defaultChecked={this.props.defaultValue && this.props.defaultValue === option[1] && this.props.defaultValue} />
							<span>{option[0]}</span>
						</label>
					})}
			</>
			default:
				return <input {...attributes}
					onBlur={() => this.validate()}
					onKeyDown={this.handleKeyDown}
					onKeyUp={this.handleKeyUp}
					value={this.props.value} />
		}
	}
	
	render() {
		const isInvalid = !this.state.isValid && this.state.errorText !== null
		const className = classNames('input', 'input-' + this.props.type, isInvalid && 'error')
		const children = <>
			{this.el(isInvalid)}
			{isInvalid ? (
				<div className="error-text">{this.state.errorText}</div>
			) : null}
		</>
		
		return this.state.canWrap ? <div className={className}>{children}</div> : <>{children}</>
	}
}

Input.defaultProps = {
	type: 'text',
	minLength: 0,
	optional: false,
	validateFor: 'text',
	wrap: false
}

Input.propTypes = {
	type: PropTypes.string,
	minLength: PropTypes.number,
	optional: PropTypes.bool,
	validateFor: PropTypes.string,
	defaultValue: PropTypes.string,
	wrap: PropTypes.bool
}

export default Input