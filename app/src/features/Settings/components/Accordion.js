import React, { useEffect, useRef, useState } from 'react'
import classNames from 'classnames'
import PropTypes from 'prop-types'

import { Icon, Input } from '../../../components/UI/index.js'

export const SaveActions = ({ ready, handleSave, handleCancel }) => {
	return <div className="actions float-r">
		<button
			className="cancel btn-secondary btn-borderless"
			onClick={handleCancel}
		>CANCEL</button>
		<button
			className={classNames(
				'save btn-primary btn-round',
				!ready && 'btn-disabled'
			)}
			onClick={(event) => {
				if (ready) handleSave(event)
			}}
		>SAVE</button>
	</div>
}

export const AccordionInput = ({ expanded, config, data, toggleAccordion, handleSave }) => {
	const inputRef = useRef(null)
	const [saveReady, setSaveReady] = useState(false)
	const [valid, setValid] = useState(false)
	const [value, setValue] = useState()
	
	useEffect(() => {
		if (data[config.name] !== undefined) {
			inputRef.current.setValue(data[config.name])
		} else if (config.default) {
			//inputRef.current.setValue(config.default)
		}
	}, [data, config])
	
	useEffect(() => {
		let readyConditionCheck = typeof config.readyCondition === 'function' ?
			config.readyCondition(value) :
			true
		
		setSaveReady(
			readyConditionCheck === true &&
			valid == true &&
			value !== data[config.name]
		)
	}, [value, valid])
	
	const handleSaveAction = () => {
		if (saveReady !== true) return
		
		toggleAccordion()
		
		if (typeof config.handleSave === 'function') {
			config.handleSave({ [config.name]: value }, config.onSave)
		} else {
			// Use default API call
			handleSave({
				inputData: typeof value === 'object' ? value : { [config.name]: value },
				settingConfig: config
			})
		}
	}
	
	const isTextOption = config.inputOptions && (
		config.inputOptions.type === 'text' ||
		config.inputOptions.type === 'textarea' ||
		config.inputOptions.type === undefined
	)
	
	return <li className={classNames(
		'accordion',
		expanded && 'expanded'
	)}>
		<div className="accordion-top" onClick={() => toggleAccordion()}>
			<span>
				<span className="label-name">{config.label || config.name}</span>
			</span>
			<span>
				{(config.preview !== undefined ? config.preview : isTextOption) && <span
					className="label-preview"
				>
					{config.preview || data[config.name]}
				</span>}
				<Icon name="chevron" rot={expanded && 90} />
			</span>
		</div>
		<div className="accordion-content" key={config.name}>
			{config.description && <div className="description">
				{config.description}
			</div>}
			<div className="inputs">
				<Input
					{...config.inputOptions}
					ref={inputRef}
					handleValueChange={setValue}
					handleValidity={setValid}
				/>
			</div>
			{!config.saveOnChange && <SaveActions
				ready={saveReady}
				handleSave={handleSaveAction}
				handleCancel={() => {
					toggleAccordion()
					inputRef.current.setValue(config.defaultValue || data[config.name])
				}}
			/>}
		</div>
	</li>
}

AccordionInput.propTypes = {
	expanded: PropTypes.bool,
	config: PropTypes.object.isRequired,
	data: PropTypes.object, // TODO: isRequired
	toggleAccordion: PropTypes.func,
	Component: PropTypes.func
}

const Accordion = ({ data, handleSave, config }) => {
	const [expanded, setExpanded] = useState([])
	
	const toggleAccordion = (index) => {
		const newExpanded = [...expanded]
		
		newExpanded[index] = !newExpanded[index]
		
		setExpanded(newExpanded)
	}
	
	// Clear expanded indexes once the page changes
	useEffect(() => {
		setExpanded([])
	}, [config])
	
	return <ul className="accordion-list">
		{config.settings.map((setting, index) => (
			<AccordionInput
				key={index}
				expanded={expanded[index]}
				toggleAccordion={() => toggleAccordion(index)}
				config={setting}
				data={data}
				handleSave={handleSave}
			/>
		))}
	</ul>
}

export default Accordion