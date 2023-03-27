import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Navigate, useParams } from 'react-router-dom'
import PropTypes from 'prop-types'
import classNames from 'classnames'

import Layout from '../Layout.js'
import Loading from '../Loading.js'
import Avatar from '../../containers/Avatar.js'
import Feed from '../../containers/Feed.js'
import { CatPills } from '../UI/index.js'

const categories = [
	{
		label: 'Account',
		category: 'account'
	},
	{
		label: 'Privacy',
		category: 'privacy'
	}
]

const Settings = () => {
	const dispatch = useDispatch()
	const { profileList, idsByUsername, invalidUsernames } = useSelector(state => ({
		profileList: state.profiles.profileList,
		idsByUsername: state.profiles.idsByUsername,
		invalidUsernames: state.profiles.invalidUsernames
	}))
	
	const [settings, setSettings] = useState({})
	
	/*const {
		data: commentData,
		error: commentError,
		loading: commentsLoading
	} = api.get(`/v1/user/settings`, null, { component: true })*/
	
	return <Layout page="settings">
		{settings === null ? <Loading /> : <div className="wrap">
			<div className="grid">
				<div className="col-4 col-desktop-4">
					<div className="heading">Settings</div>
					<CatPills
						pills={categories}
						default={categories[0].category}
						squared
						handleSelection={type => {
							console.log('selected pill of type:', type)
						}}
					/>
				</div>
				<div className="col-8 col-desktop-8">
					<div className="heading">Settings</div>
					<CatPills
						pills={categories}
						default={categories[0].category}
						squared
						handleSelection={type => {
							console.log('selected pill of type:', type)
						}}
					/>
				</div>
			</div>
		</div>}
	</Layout>
}

export default Settings