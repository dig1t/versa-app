import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom'

import Loading from '../Loading.js'
import Layout from '../Layout.js'
import { CatPills } from '../UI/index.js'
import SettingsPage from '../../containers/SettingsPage.js'
import { USER_UPDATE } from '../../reducers/user.js'
import { PROFILE_UPDATE } from '../../reducers/profiles.js'
import { useAuthenticated } from '../../context/Auth.js'

const settingsConfig = [
	/*
	// Example category
	{
		label: 'Category',
		name: 'category',
		description: 'Lorem ipsum dolor',
		
		// Require user to re-authenticate before allowing changes
		requireAuthToSubmit: true,
		
		selector: ({ state, userId }) => ({
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
				handleSubmit: (newData, onSave) => {
					api.post('/settings/email', { email: newData.email })
						.then(() => onSave(newData))
				},
				saveAction: ({ updates, resultFromAPI, userId }) => {
					console.log('Data saved: ', newData)
				}
			}
		]
	}*/
	{
		label: 'Account',
		name: 'account',
		description: 'Must authenticate to view account settings.',
		
		requireAuthToSubmit: true,
		
		selector: ({ state, userId }) => ({
			email: state.user.email,
			username: state.profiles.profileList[userId].username
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
				saveAction: ({ updated }) => ({
					type: USER_UPDATE,
					payload: {
						key: 'email',
						value: updated.email
					}
				})
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
				saveAction: ({ updated, userId }) => ({
					type: PROFILE_UPDATE,
					payload: {
						key: 'username',
						value: updated.username,
						userId
					}
				})
			},
			{
				name: 'password',
				label: 'Password',
				description: 'Choose a strong password. Minimum of 6 characters.',
				inputOptions: {
					type: 'password',
					placeholder: 'New password',
					attributes: {
						autoComplete: 'false'
					}
				}
			}
		]
	},
	{
		label: 'Privacy',
		name: 'privacy',
		
		selector: ({ state, userId }) => ({
			private: state.profiles.profileList[userId].private
		}),
		
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
				saveAction: ({ updated, userId }) => ({
					type: PROFILE_UPDATE,
					payload: {
						key: 'private',
						value: updated.private,
						userId
					}
				})
			}
		]
	}
]

const Settings = () => {
	const { categoryParam } = useParams()
	const { userId } = useAuthenticated()
	
	const navigate = useNavigate()
	const [initialCategory, setInitialCategory] = useState(settingsConfig[0].name)
	const profileList = useSelector(state => state.profiles.profileList)
	const [category, setCategory] = useState()
	
	useEffect(() => {
		if (categoryParam) {
			if (settingsConfig.find(category => category.name === categoryParam)) {
				setInitialCategory(categoryParam)
			} else {
				navigate('/settings')
			}
		}
	}, [categoryParam])
	
	const profile = profileList[userId]
	
	return <Layout page="settings">
		{profile ? <div className="wrap grid">
			<div className="settings-categories col-3 col-desktop-3">
				<div className="heading">Settings</div>
				<CatPills
					pills={settingsConfig}
					defaultCategory={initialCategory}
					squared
					handleSelection={category => setCategory(category)}
				/>
			</div>
			<div className="settings-page col-9 col-desktop-9">
				{category !== undefined && <SettingsPage
					config={category}
				/>}
			</div>
		</div> : <Loading />}
	</Layout>
}

export default Settings