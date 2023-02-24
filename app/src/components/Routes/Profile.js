import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Navigate, useParams } from 'react-router-dom'

import Layout from '../Layout.js'
import Loading from '../Loading.js'
import Avatar from '../../containers/Avatar.js'
import Feed from '../../containers/Feed.js'
import { CatPills, Icon } from '../UI/index.js'
import { getProfileFromUsername } from '../../actions/profile.js'

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
		isFollowing ? 'Unfollow' : 'Follow'
	}</button>
}

const Profile = () => {
	const dispatch = useDispatch()
	const { profileList, username, invalidProfiles } = useSelector(state => ({
		profileList: state.profiles.profileList,
		invalidProfiles: state.profiles.invalidProfiles,
		username: state.user.profile.username
	}))
	
	const { usernameParam } = useParams()
	const [profileData, setProfileData] = useState(null)
	const [usernameQuery, setUsernameQuery] = useState(null)
	const [isUserProfile, setIsUserProfile] = useState(false)
	const [redirect, setRedirect] = useState(null)
	const [fetching, setFetching] = useState(false)
	//const [isFriend, setIsFriend] = useState(false)
	
	useEffect(() => {
		const param = /\@(\w+)/.exec(usernameParam)
		const usernameExec = param && param[1]
		
		usernameExec ? setUsernameQuery(usernameExec) : setRedirect('/error')
	}, [])
	
	useEffect(() => {
		const invalidProfile = invalidProfiles.find(invalidUsername => invalidUsername === usernameQuery)
		
		if (invalidProfile) return setRedirect('/error?e=no-user')
		
		if (profileData !== null || usernameQuery === null) return
		
		const profile = profileList.find(data => data.username === usernameQuery)
		
		if (profile) {
			setProfileData(profile)
		} else if (!fetching) {
			setFetching(true)
			dispatch(getProfileFromUsername(usernameQuery))
		}
	}, [usernameQuery, profileList, invalidProfiles])
	
	useEffect(() => {
		if (!profileData) return
		
		profileData && setIsUserProfile(profileData.username === username)
	}, [username, profileData])
	
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
							<Avatar userId={profileData.userId} />
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
						{isUserProfile ? <button className="edit-profile btn-round btn-outline">
							Edit Profile
						</button> : <FollowButton userId={profileData.userId} />}
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
					<Feed userId={profileData.userId} />
				</div>
			</div>
		</div>}
	</Layout>
}

export default Profile