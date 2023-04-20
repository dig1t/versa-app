import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom'

import Loading from '../Loading.js'
import Layout from '../Layout.js'
import { CatPills } from '../UI/index.js'
import SettingsPage from '../../containers/SettingsPage.js'
import { useAuthenticated } from '../../context/Auth.js'
import settingsPageConfig from '../../config/settingsPageConfig.js'

const Settings = () => {
	const { categoryParam } = useParams()
	const { userId } = useAuthenticated()
	
	const navigate = useNavigate()
	const [initialCategory, setInitialCategory] = useState(settingsPageConfig[0].name)
	const profileList = useSelector((state) => state.profiles.profileList)
	const [category, setCategory] = useState()
	
	useEffect(() => {
		if (categoryParam) {
			const categoryExists = settingsPageConfig.find((category) => category.name === categoryParam) !== undefined
			
			console.log(categoryParam, categoryExists)
			
			if (categoryExists) {
				setInitialCategory(categoryParam)
			} else {
				navigate('/settings')
			}
		}
	}, [categoryParam])
	
	useEffect(() => {
		const path = category && `/settings/${category.name}`
		
		// eslint-disable-next-line no-undef
		if (category && location.pathname !== path) {
			navigate(path, { replace: true })
		}
	}, [category])
	
	const profile = profileList[userId]
	
	return <Layout page="settings">
		{profile ? <div className="wrap grid">
			<div className="settings-categories col-3 col-desktop-3">
				<div className="heading">Settings</div>
				<CatPills
					pills={settingsPageConfig}
					defaultCategory={initialCategory}
					squared
					handleSelection={(category) => setCategory(category)}
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