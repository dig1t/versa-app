import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import classNames from 'classnames'

import Layout from '../Layout.js'
import Loading from '../Loading.js'
import { CatPills } from '../UI/index.js'
import SettingsPage from '../../containers/SettingsPage.js'

const settingsConfig = [
	/*
	// Example category
	{
		label: 'Category',
		name: 'category',
		description: 'Lorem ipsum dolor',
		
		// Require user to re-authenticate before allowing changes
		requireAuthToSubmit: true,
		
		selector: state => ({
			user: state.user
		}),
		
		settings: [
			{
				name: 'email',
				label: 'Email',
				inputOptions: {
					type: 'text',
					validateFor: 'email'
				},
				preview: 'digit@gmail.com',
				saveOnChange: false, // Shows save/cancel actions
				handleSubmit: newData => {
					api.post('/settings/email', { email: newData.email })
				}
			}
		]
	}*/
	{
		label: 'Account',
		name: 'account',
		description: 'Must authenticate to view account settings.',
		
		requireAuthToSubmit: true,
		
		selector: state => ({
			email: state.user.email,
			username: state.user.profile?.username
		}),
		
		settings: [
			{
				name: 'email',
				label: 'Email',
				inputOptions: {
					type: 'text',
					validateFor: 'email',
					attributes: {
						autoComplete: 'false'
					}
				},
				//saveOnChange: true,
				handleSubmit: newData => {
					console.log('SUBMIT THIS DATA:', newData)
				}
			},
			{
				name: 'username',
				label: 'Username',
				description: 'You may only change your username once every 2 weeks.',
				inputOptions: {
					type: 'text',
					validateFor: 'username',
					attributes: {
						autoComplete: 'false'
					}
				},
				endpoint: '/v1/settings',
				endpointMethod: 'put' // default: put
			},
			{
				name: 'password',
				label: 'Password',
				description: 'Choose a strong password.',
				inputOptions: {
					type: 'password',
					attributes: {
						autoComplete: 'false'
					}
				},
				endpoint: '/v1/settings',
				endpointMethod: 'put' // default: put
			}
		]
	},
	/*{
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
	}*/
]

const useSettings = () => {
	const preferences = useSelector(state => state.user.settings)
	const account = useSelector(state => ({
		email: state.user.email,
		username: state.user.profile?.username
	}))
	const profile = useSelector(state => state.user.profile)
	
	const [settings, setSettings] = useState({
		preferences,
		account,
		profile
	})
	
	useEffect(() => setSettings({
		preferences,
		account,
		profile
	}), [preferences, account, profile])
	
	return { settings }
}

const Settings = () => {
	//const { settings } = useSettings()
	const [category, setCategory] = useState()
	
	const handleSelection = category => setCategory(category)
	
	return <Layout page="settings">
		<div className="wrap grid">
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
				/>}
			</div>
		</div>
	</Layout>
}

export default Settings