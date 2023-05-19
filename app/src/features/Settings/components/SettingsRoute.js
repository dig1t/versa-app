import React, { useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

import Loading from '../../Core/components/Loading.js'
import Layout from '../../Core/components/Layout.js'
import { CatPills } from '../../../components/UI.js'
import SettingsPage from './SettingsPage.js'
import settingsPageConfig from '../settingsPageConfig.js'
import useProfile from '../../User/hooks/useProfile.js'

const initialCategory = settingsPageConfig[0]

const Settings = () => {
	const { categoryParam } = useParams()
	const navigate = useNavigate()
	const profile = useProfile()
	
	const category = settingsPageConfig.find((cat) => cat.name === categoryParam) || initialCategory
	
	useEffect(() => {
		if (!categoryParam) {
			navigate(`/settings/${initialCategory.name}`)
		}
	}, [categoryParam])
	
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