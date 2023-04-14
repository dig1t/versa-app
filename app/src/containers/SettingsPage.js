import React, { useEffect, useRef, useState } from 'react'
import classNames from 'classnames'
import PropTypes from 'prop-types'

import api from '../util/api.js'
import { Icon, Input } from '../components/UI/index.js'
import { useDispatch, useSelector } from 'react-redux'
import { useAuthenticated } from '../context/Auth.js'

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
			onClick={handleSave}
		>SAVE</button>
	</div>
}

const AccordionSetting = ({ expanded, config, data, toggleAccordion, handleSave }) => {
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
	
	return <div className={classNames(
		'accordion',
		expanded && 'expanded'
	)}>
		<div className="accordion-top" onClick={() => toggleAccordion()}>
			<span>
				<span className="name">{config.label || config.name}</span>
			</span>
			<span>
				{(config.preview !== undefined ? config.preview : isTextOption) && <span
					className="preview"
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
	</div>
}

AccordionSetting.propTypes = {
	expanded: PropTypes.bool,
	config: PropTypes.object.isRequired,
	data: PropTypes.object, // TODO: isRequired
	toggleAccordion: PropTypes.func,
	Component: PropTypes.func
}

const SettingsPage = ({ config }) => {
	const dispatch = useDispatch()
	const { userId } = useAuthenticated()
	const data = useSelector(state => config.selector({ state, userId }))
	
	const [expanded, setExpanded] = useState([])
	
	const toggleAccordion = index => {
		const newExpanded = [...expanded]
		
		newExpanded[index] = !newExpanded[index]
		
		setExpanded(newExpanded)
	}
	
	const handleSave = ({ inputData, settingConfig }) => {
		if (!inputData) return
		
		return api.post(settingConfig.endpoint || `/v1/user/${userId}/settings`, inputData)
			.then(data => {
				// eslint-disable-next-line no-undef
				console.log(`Saved ${settingConfig.name}`)
				
				if (settingConfig.saveAction) {
					dispatch(settingConfig.saveAction({
						updated: inputData,
						resultFromAPI: data,
						userId
					}))
				}
			})
	}
	
	const Component = config.component
	
	// Clear expanded indexes once the page changes
	useEffect(() => setExpanded([]), [config])
	
	return <div className="container">
		<div className="header">
			<div className="title">{config.label}</div>
			<div className="description">{config.description}</div>
		</div>
		<ul>
			{config.settings && config.settings.map((setting, index) => (
				<li key={index}>
					<AccordionSetting
						expanded={expanded[index]}
						toggleAccordion={() => toggleAccordion(index)}
						config={setting}
						data={data}
						handleSave={handleSave}
					/>
				</li>
			))}
			{config.component && <Component
				data={data}
				handleSave={data => handleSave({
					data,
					settingConfig: config
				})}
			/>}
		</ul>
	</div>
}

SettingsPage.propTypes = {
	config: PropTypes.object.isRequired
}

export default SettingsPage