import React, { useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Navigate, useParams } from 'react-router-dom'
import PropTypes from 'prop-types'
import classNames from 'classnames'

import Layout from '../Layout.js'
import Loading from '../Loading.js'
import Avatar from '../../containers/Avatar.js'
import Feed from '../../containers/Feed.js'
import { CatPills, Icon, Input } from '../UI/index.js'

const settingsConfig = [
	{
		label: 'Account',
		name: 'account',
		description: 'Must authenticate to view account settings.',
		requireAuthToFetch: true, // TODO: implement
		
		settings: [
			{
				name: 'email',
				label: 'Email',
				default: 'me@versa.co',
				inputOptions: {
					type: 'text',
					validateFor: 'email'
				},
				endpoint: '/v1/settings/email',
				endpointMethod: 'put' // default: put
			},
			{
				name: 'username',
				label: 'Username',
				description: 'You may only change your username once every 2 weeks.',
				default: 'dig1t',
				inputOptions: {
					type: 'text',
					validateFor: 'username'
				},
				endpoint: '/v1/settings/username',
				endpointMethod: 'put' // default: put
			}
		]
	},
	{
		label: 'Privacy',
		name: 'privacy',
		
		settings: [
			{
				name: 'Private Profile',
				description: 'Your profile will only be visible to mutual followers.',
				default: '0',
				inputOptions: {
					type: 'checkboxes',
					options: [
						['Private', 'private']
					]
				},
				endpoint: '/v1/user/email'
			}
		]
	}
]

const Setting = ({ expanded, config, data = {}, toggleAccordion }) => {
	const [initialData, setInitialData] = useState({ value: '' })
	const [inputData, setInputData] = useState({ value: '' })
	const [saveReady, setSaveReady] = useState(false)
	const [inputValid, setInputValid] = useState(false)
	
	useEffect(() => {
		setInitialData({ value: data[config.name] || config.default})
	}, [config])
	
	useEffect(() => {
		if (typeof config.readyCondition === 'function') {
			if (config.readyCondition(inputData) !== true) return
		}
		
		setSaveReady(inputValid == true && inputData.value !== initialData.value)
	}, [inputData, inputValid])
	
	useEffect(() => {
		setInputData({ value: initialData.value })
		setInputValid(false)
	}, [initialData])
	
	const handleSubmit = event => {
		if (inputValid !== true) return
		console.log('save to api', config.endpoint, inputData.value)
		
		const dataValue = inputData.value
		
		toggleAccordion()
		
		/*api.post(config.endpoint, { dataValue })
			.then(response => {
				if (!props.handleSuccess) return
				
				props.handleSuccess(response)
			})*/
	}
	
	const Component = config.component || Input
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
				{ isTextOption && <span
					className="preview"
				>
					{data.value || config.placeholder || config.default}
				</span>}
				<Icon name="chevron" rot={expanded && 90} />
			</span>
		</div>
		<div className="accordion-content">
			{config.description && <div className="description">
				{config.description}
			</div>}
			<div className="inputs">
				<Component
					handleValueChange={value => {
						setInputData({ value: value })
					}}
					handleValidity={valid => setInputValid(valid)}
					value={inputData.value}
					{...config.inputOptions}
				/>
			</div>
			<div className="actions float-r">
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
			</div>
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

const SettingsPage = ({ config, data }) => {
	const [expanded, setExpanded] = useState([])
	
	const toggleAccordion = index => {
		const newExpanded = [...expanded]
		
		newExpanded[index] = !newExpanded[index]
		
		setExpanded(newExpanded)
	}
	
	useEffect(() => {
		// Clear expanded indexes once the page changes
		setExpanded([])
	}, [config])
	
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
	data: PropTypes.object
}

const Settings = () => {
	const dispatch = useDispatch()
	const { settings } = useSelector(state => state.user.settings)
	
	const [settingsData, setSettingsData] = useState({})
	const [category, setCategory] = useState()
	const [authenticated, setAuthenticated] = useState(false)
	
	/*const {
		data: settingsData,
		error,
		loading:
	} = api.get(`/v1/user/settings`, null, { useHook: true })*/
	
	const handleSelection = category => setCategory(category)
	
	return <Layout page="settings">
		{settingsData !== null && <div className="wrap grid">
			<div className="settings-categories col-3 col-desktop-3">
				<div className="heading">Settings</div>
				<CatPills
					pills={settingsConfig}
					default={settingsConfig[0].name}
					squared
					handleSelection={handleSelection}
				/>
			</div>
			<div className="settings-page col-9 col-desktop-9">
				{category !== undefined && <SettingsPage
					config={category}
					data={settingsData}
				/>}
			</div>
		</div>}
	</Layout>
}

export default Settings