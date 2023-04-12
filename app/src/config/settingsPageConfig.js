import { USER_UPDATE } from '../reducers/user.js'
import { PROFILE_UPDATE } from '../reducers/profiles.js'
import ProfileSettings from './settings/profile.js'

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
			handleSave: (newData, onSave) => {
				api.post('/settings/email', { email: newData.email })
					.then(() => onSave(newData))
			},
			saveAction: ({ updates, resultFromAPI, userId }) => {
				console.log('Data saved: ', newData)
			}
		}
	]
}*/

export default [
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
					options: {
						checkboxes: [
							['Private', 'private']
						]
					}
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
	},
	{
		label: 'Profile',
		name: 'profile',
		
		selector: ({ state, userId }) => ({
			profile: state.profiles.profileList[userId]
		}),
		
		component: ProfileSettings
	}
]