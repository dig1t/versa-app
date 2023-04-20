import React from 'react'
import classNames from 'classnames'
import PropTypes from 'prop-types'
import { useDispatch, useSelector } from 'react-redux'

import api from '../util/api.js'
import { useAuthenticated } from '../context/Auth.js'
import Accordion from './settings/Accordion.js'

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

const SettingsPage = ({ config }) => {
	const dispatch = useDispatch()
	const { userId } = useAuthenticated()
	const data = useSelector((state) => config.selector({ state, userId }))
	
	const handleSave = ({ inputData, settingConfig = config }) => {
		if (!inputData) return
		
		return api.post(settingConfig.endpoint || `/v1/user/${userId}/settings`, inputData)
			.then((apiResult) => {
				// eslint-disable-next-line no-undef
				console.log(`Saved ${settingConfig.name}`)
				
				if (settingConfig.saveAction) {
					dispatch(settingConfig.saveAction({
						updated: inputData,
						apiResult,
						userId
					}))
				}
			})
	}
	
	const Component = config.component
	
	return <div className="container">
		<div className="header">
			<div className="title">{config.label}</div>
			<div className="description">{config.description}</div>
		</div>
		
		{config.settings && <Accordion
			key={config.name}
			data={data}
			handleSave={handleSave}
			config={config}
		/>}
		
		{config.component && <Component
			key={config.name}
			data={data}
			handleSave={handleSave}
			config={config}
		/>}
	</div>
}

SettingsPage.propTypes = {
	config: PropTypes.object.isRequired
}

export default SettingsPage