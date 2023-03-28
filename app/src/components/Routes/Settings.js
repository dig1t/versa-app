import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Navigate, useParams } from 'react-router-dom'
import PropTypes from 'prop-types'
import classNames from 'classnames'

import Layout from '../Layout.js'
import Loading from '../Loading.js'
import Avatar from '../../containers/Avatar.js'
import Feed from '../../containers/Feed.js'
import { CatPills, Icon } from '../UI/index.js'

const pageCategories = [
	{
		label: 'Account',
		name: 'account',
		requireAuth: true,
		
		settings: [
			{
				name: 'Email',
				default: 'john@versa.co',
				type: 'text',
				apiEndpoint: '/v1/user/email',
				apiEndpointMethod: 'put' // default: put
			}
		]
	},
	{
		label: 'Privacy',
		name: 'privacy',
		
		settings: [
			{
				name: 'Private Profile',
				description: 'Your profile will only be visible to mutual followers',
				default: false,
				type: 'bool',
				endpoint: '/v1/user/email'
			},
			{
				name: 'Private Profile',
				description: 'Your profile will only be visible to mutual followers',
				default: false,
				type: 'bool',
				endpoint: '/v1/user/email'
			}
		]
	}
]

const Setting = props => {
	const [expanded, setExpanded] = useState(false)
	
	return <div className={classNames(
		'setting', expanded && 'expanded'
	)}>
		<div
			className="accordion"
			role="button"
			onClick={() => {
				
			}}
		>
			<Icon name="chevron" rotation="90" />
		</div>
	</div>
}

Setting.propTypes = {
	name: PropTypes.string.isRequired,
	apiRoute: PropTypes.string.isRequired
}

const SettingsPage = ({ config, data }) => {
	return <div className="settings-page">
		<div className="heading">{config.label}</div>
	</div>
}

SettingsPage.propTypes = {
	config: PropTypes.object.isRequired,
	data: PropTypes.object.isRequired
}

const Settings = () => {
	const dispatch = useDispatch()
	const { profileList, idsByUsername, invalidUsernames } = useSelector(state => ({
		profileList: state.profiles.profileList,
		idsByUsername: state.profiles.idsByUsername,
		invalidUsernames: state.profiles.invalidUsernames
	}))
	
	const [settingsData, setSettingsData] = useState({
		account: {
			email: 'test@versa.co'
		}
	})
	const [category, setCategory] = useState()
	const [authenticated, setAuthenticated] = useState(false)
	
	/*const {
		data: settingsData,
		error,
		loading:
	} = api.get(`/v1/user/settings`, null, { component: true })*/
	
	const handleSelection = category => {
		setCategory(category)
		console.log('selected pill of type:', category.name)
	}
	
	return <Layout page="settings">
		{settingsData !== null && <div className="wrap">
			<div className="grid">
				<div className="col-4 col-desktop-4">
					<div className="heading">Settings</div>
					<CatPills
						pills={pageCategories}
						default={pageCategories[0].name}
						squared
						handleSelection={handleSelection}
					/>
				</div>
				<div className="col-8 col-desktop-8">
					{category !== undefined && settingsData[category.name] && <SettingsPage
						config={category}
						data={settingsData[category.name]}
					/>}
				</div>
			</div>
		</div>}
	</Layout>
}

export default Settings