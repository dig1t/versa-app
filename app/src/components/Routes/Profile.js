import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { Navigate, useParams } from 'react-router-dom'

import Layout from '../Layout.js'
import Loading from '../Loading.js'
import Avatar from '../../containers/Avatar.js'
import Feed from '../../containers/Feed.js'
import { CatPills, Icon } from '../UI/index.js'

const feedCategories = [
	{
		label: 'Posts',
		category: 'posts'
	},
	{
		label: 'Photos',
		category: 'photos'
	},
	{
		label: 'Videos',
		category: 'videos'
	}
]

const FollowButton = props => {
	const isFollowing = false
	
	return <button className="edit-profile btn-round btn-outline">{
		
	}</button>
}

const Profile = () => {
	const { profileList, username } = useSelector(state => ({
		profileList: state.profiles.profileList,
		username: state.user.username
	}))
	
	const { usernameParam } = useParams()
	const [profileData, setProfileData] = useState(null)
	const [usernameQuery, setUsernameQuery] = useState({})
	const [isUserProfile, setIsUserProfile] = useState(false)
	const [redirect, setRedirect] = useState(null)
	//const [isFriend, setIsFriend] = useState(false)
	
	useEffect(() => {
		const param = /\@(\w+)/.exec(usernameParam)
		const usernameExec = param && param[1]
		
		usernameExec ? setUsernameQuery(usernameExec) : setRedirect('/error')
	}, [])
	
	useEffect(() => {
		const profile = profileList.find(data => data.username === usernameQuery)
		
		if (profile && profile.username === usernameQuery) {
			setIsUserProfile(profile.username === username)
			setProfileData(profile)
		} else {
			//setRedirect('/error?e=no-user')
		}
	}, [usernameQuery, profileList])
	
	return <Layout page="profile">
		{redirect && <Navigate to={redirect} />}
		{profileData === null ? <Loading /> : <div className="wrap grid-g">
			<div className="col-12 col-desktop-4">
				<div className="info box">
					<div className="banner">
						<div className="img" />
					</div>
					<div className="details">
						<div className="avatar-container">
							<Avatar img={profileData.avatar} />
						</div>
						<div className="container">
							<div className="name align-center-wrap">
								<span>{profileData.name}</span>
								<Icon
									svg
									name="verified"
									hidden={!profileData.verificationLevel || profileData.verificationLevel === 0}
								/>
							</div>
							<div className="username">@{profileData.username}</div>
							{profileData.bio && <div className="bio">{profileData.bio}</div>}
							{profileData.website && <div className="website">
								<a href={'//' + profileData.website} target="_blank">
									{profileData.website}
								</a>
							</div>}
						</div>
						{isUserProfile && <button className="edit-profile btn-round btn-outline">Edit Profile</button>}
					</div>
					<div className="community-stats grid">
						<div className="stat col-6">
							<div className="value">{profileData.followers || 0}</div>
							<div className="label">followers</div>
						</div>
						<div className="stat col-6">
							<div className="value">{profileData.following || 0}</div>
							<div className="label">following</div>
						</div>
					</div>
				</div>
			</div>
			<div className="col-12 col-desktop-8">
				<div className="feed box">
					<CatPills
						pills={feedCategories}
						default={profileData.defaultCategory || 'posts'}
						squared
						handleSelection={type => {
							console.log('selected pill of type:', type)
						}}
					/>
					<Feed />
				</div>
			</div>
		</div>}
	</Layout>
}

export default Profile