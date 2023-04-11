import React, { useEffect, useState } from 'react'
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
	const [initialData, setInitialData] = useState({ ...data })
	const [inputData, setInputData] = useState({
		[config.name]: data[config.name] || ''
	})
	const [saveReady, setSaveReady] = useState(false)
	const [inputValid, setInputValid] = useState(false)
	
	useEffect(() => {
		//if (data[config.name] !== initialData[config.name])
		
		setInitialData({ ...data })
		setInputData({
			[config.name]: data[config.name] || ''
		})
	}, [data, config])
	
	useEffect(() => {
		if (typeof config.readyCondition === 'function') {
			if (config.readyCondition(inputData) !== true) return
		}
		
		setSaveReady(
			inputValid == true && inputData[config.name] !== data[config.name]
		)
	}, [inputData, inputValid])
	
	const handleSaveAction = () => {
		if (saveReady !== true) return
		
		const inputDataDraft = { ...inputData }
		
		toggleAccordion()
		
		if (typeof config.handleSave === 'function') {
			config.handleSave(inputDataDraft, config.onSave)
		} else {
			// Use default API call
			handleSave({
				inputData: inputDataDraft,
				settingConfig: config
			})
		}
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
						setInputData({ [config.name]: value || '' })
					}}
					handleValidity={validity => setInputValid(validity)}
					value={inputData[config.name]}
				/>
			</div>
			{!config.saveOnChange && <SaveActions
				ready={saveReady}
				handleSave={handleSaveAction}
				handleCancel={() => {
					toggleAccordion()
					setInputData({ [config.name]: data[config.name] })
				}}
			/>}
		</div>
	</div>
}

AccordionSetting.defaultProps = {
	Component: props => <Input {...props} />
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
				handleSave={handleSave}
			/>}
		</ul>
	</div>
}

SettingsPage.propTypes = {
	config: PropTypes.object.isRequired
}

export default SettingsPage