import React, { useEffect, useMemo, useState } from 'react'
import classNames from 'classnames'
import PropTypes from 'prop-types'

import api from '../util/api.js'
import { Icon, Input } from '../components/UI/index.js'
import { useSelector } from 'react-redux'

const Setting = ({ expanded, config, data, toggleAccordion }) => {
	const [initialData, setInitialData] = useState({})
	const [inputData, setInputData] = useState({ value: '' })
	//const [inputData, setInputData] = useState({ value: '' })
	const [saveReady, setSaveReady] = useState(false)
	const [inputValid, setInputValid] = useState(false)
	
	useEffect(() => {
		if (initialData[config.name] !== data[config.name]) {
			console.log(183783128)
			setInputData({ value: data[config.name] || '1' })
		}
	}, [data])
	
	useEffect(() => {
		if (typeof config.readyCondition === 'function') {
			if (config.readyCondition(inputData) !== true) return
		}
		
		setSaveReady(inputValid == true && inputData.value !== data[config.name])
	}, [inputData, inputValid])
	
	const handleSubmit = event => {
		if (inputValid !== true) return
		console.log('save to api', config.endpoint, inputData.value)
		
		const dataValue = inputData.value
		
		toggleAccordion()
		
		config.handleSubmit(inputData)
	}
	
	//const Component = config.component
	
	const isTextOption = config.inputOptions && (
			config.inputOptions.type === 'text' ||
			config.inputOptions.type === 'textarea' ||
			config.inputOptions.type === undefined
		)
	
	return <div className={classNames(
		'accordion',
		expanded && 'expanded'
	)}>
		<div className="accordion-top" onClick={() => toggleAccordion()}>
			<span>
				<span className="name">{config.label || config.name}</span>
			</span>
			<span>
				{ (config.preview || isTextOption) && <span
					className="preview"
				>
					{config.preview || data[config.name]}
				</span>}
				<Icon name="chevron" rot={expanded && 90} />
			</span>
		</div>
		<div className="accordion-content">
			{config.description && <div className="description">
				{config.description}
			</div>}
			<div className="inputs">
				<Input
					{...config.inputOptions}
					handleValueChange={value => {
						console.log(1, value)
						setInputData({ value: value })
					}}
					handleValidity={valid => setInputValid(valid)}
					value={inputData.value}
				/>
			</div>
			{!config.saveOnChange && <div className="actions float-r">
				<button
					className="cancel btn-secondary btn-borderless"
					onClick={toggleAccordion}
				>CANCEL</button>
				<button
					className={classNames(
						'save btn-primary btn-round',
						!saveReady && 'btn-disabled'
					)}
					onClick={handleSubmit}
				>SAVE</button>
			</div>}
		</div>
	</div>
}

Setting.defaultProps = {
	Component: props => <Input {...props} />
}

Setting.propTypes = {
	expanded: PropTypes.bool,
	config: PropTypes.object.isRequired,
	data: PropTypes.object, // TODO: isRequired
	toggleAccordion: PropTypes.func,
	Component: PropTypes.func
}

const SettingsPage = ({ config, settings }) => {
	const data = useSelector(state => config.selector(state))
	
	const [expanded, setExpanded] = useState([])
	
	const toggleAccordion = index => {
		const newExpanded = [...expanded]
		
		newExpanded[index] = !newExpanded[index]
		
		setExpanded(newExpanded)
	}
	
	// Clear expanded indexes once the page changes
	useEffect(() => setExpanded([]), [config])
	useEffect(() => console.log('DATA',data), [data])
	
	return <div className="settings-page">
		<div className="header">
			<div className="title">{config.label}</div>
			<div className="description">{config.description}</div>
		</div>
		<ul>
			{config.settings && config.settings.map((setting, index) => (
				<li key={index}>
					<Setting
						expanded={expanded[index]}
						toggleAccordion={() => toggleAccordion(index)}
						config={setting}
						data={data}
					/>
				</li>
			))}
		</ul>
	</div>
}

SettingsPage.propTypes = {
	config: PropTypes.object.isRequired,
	//data: PropTypes.object.isRequired
}

export default SettingsPage