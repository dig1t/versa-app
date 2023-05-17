import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom'

import Loading from '../Loading.js'
import Layout from '../Layout.js'
import { CatPills } from '../UI/index.js'
import SettingsPage from '../../features/Settings/components/SettingsPage.js'
import { useAuthenticated } from '../../context/Auth.js'
import settingsPageConfig from '../../features/Settings/settingsPageConfig.js'

const initialCategory = settingsPageConfig[0]

const Settings = () => {
	const { categoryParam } = useParams()
	const { userId } = useAuthenticated()
	
	const navigate = useNavigate()
	const profileList = useSelector((state) => state.profiles.profileList)
	
	const category = settingsPageConfig.find((cat) => cat.name === categoryParam) || initialCategory
	
	useEffect(() => {
		if (!categoryParam) {
			navigate(`/settings/${initialCategory.name}`)
		}
	}, [categoryParam])
	
	const profile = profileList[userId]
	
	return <Layout page="settings">
		{profile ? <div className="wrap grid">
			<div className="settings-categories col-3 col-desktop-3">
				<div className="heading">Settings</div>
				<CatPills
					pills={settingsPageConfig}
					defaultCategory={category?.name || initialCategory.name}
					handleSelection={(category) => {
						console.log('new category', category.name)
						//setCategory(category)
						navigate(`/settings/${category.name}`, { replace: true })
					}}
					autoSelect={false}
					squared
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