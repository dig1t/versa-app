import React, { useEffect, useMemo, useState } from 'react'
import classNames from 'classnames'
import PropTypes from 'prop-types'

import api from '../util/api.js'
import { Icon, Input } from '../components/UI/index.js'
import { useDispatch, useSelector } from 'react-redux'
import { useAuthenticated } from '../context/Auth.js'

const Setting = ({ expanded, config, data, toggleAccordion }) => {
	const dispatch = useDispatch()
	
	const [initialData, setInitialData] = useState({ ...data })
	const [inputData, setInputData] = useState({
		[config.name]: data[config.name] || ''
	})
	const [saveReady, setSaveReady] = useState(false)
	const [inputValid, setInputValid] = useState(false)
	const { userId } = useAuthenticated()
	
	useEffect(() => {
		if (data[config.name] !== initialData[config.name])
		
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
	
	const handleSubmit = () => {
		if (saveReady !== true) return
		
		//console.log('save to api', config.endpoint, inputData[config.name])
		
		const inputDataDraft = { ...inputData }
		
		toggleAccordion()
		
		if (typeof config.handleSubmit === 'function') {
			config.handleSubmit(inputDataDraft, config.onSave)
		} else {
			// Use default API call
			api.post(config.endpoint || `/v1/user/${userId}/settings`, inputDataDraft)
				.then(data => {
					// eslint-disable-next-line no-undef
					console.log(`Saved ${config.name}`)
					
					if (config.saveAction) {
						dispatch(config.saveAction({
							updated: inputDataDraft,
							resultFromAPI: data,
							userId
						}))
					}
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
			{!config.saveOnChange && <div className="actions float-r">
				<button
					className="cancel btn-secondary btn-borderless"
					onClick={() => {
						toggleAccordion()
						setInputData({ [config.name]: data[config.name] })
					}}
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

const SettingsPage = ({ config }) => {
	const { userId } = useAuthenticated()
	const data = useSelector(state => config.selector({ state, userId }))
	
	const [expanded, setExpanded] = useState([])
	
	const toggleAccordion = index => {
		const newExpanded = [...expanded]
		
		newExpanded[index] = !newExpanded[index]
		
		setExpanded(newExpanded)
	}
	
	// Clear expanded indexes once the page changes
	useEffect(() => setExpanded([]), [config])
	
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
	config: PropTypes.object.isRequired
}

export default SettingsPage