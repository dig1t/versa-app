import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Navigate, useParams } from 'react-router-dom'
import PropTypes from 'prop-types'

import api from '../../util/api.js'
import Layout from '../Layout.js'
import Loading from '../Loading.js'
import Avatar from '../../containers/Avatar.js'
import Feed from '../../containers/Feed.js'
import { CatPills, Icon } from '../UI/index.js'
import { followProfile, getProfileFromUsername } from '../../actions/profile.js'
import classNames from 'classnames'
import { binarySearch } from '../../util/index.js'

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
	const [requesting, setRequesting] = useState(false)
	const dispatch = useDispatch()
	
	const handleClick = input => {
		input.preventDefault()
		
		// Prevent user from spamming the server
		if (requesting) return console.log('dont spam')
		
		console.log('FOLLOW?', !props.following)
		//setRequesting(true)
		dispatch(followProfile(props.userId, !props.following))
	}
	
	return <button
		className={classNames(
			'cta edit-profile btn-round btn-outline',
			props.following ? 'btn-secondary following' : 'not-following'
		)}
		onClick={handleClick}
	>{
		props.following ? 'Unfollow' : 'Follow'
	}</button>
}

FollowButton.propTypes = {
	following: PropTypes.bool.isRequired,
	userId: PropTypes.string.isRequired
}

const Profile = () => {
	const dispatch = useDispatch()
	const { profileList, idsByUsername, invalidUsernames } = useSelector(state => ({
		profileList: state.profiles.profileList,
		idsByUsername: state.profiles.idsByUsername,
		invalidUsernames: state.profiles.invalidUsernames
	}))
	
	const { usernameParam } = useParams()
	const [profileData, setProfileData] = useState(null)
	const [usernameQuery, setUsernameQuery] = useState(null)
	const [redirect, setRedirect] = useState(null)
	const [fetching, setFetching] = useState(false)
	//const [isFriend, setIsFriend] = useState(false)
	
	useEffect(() => {
		console.log(profileData)
	}, [profileData])
	
	useEffect(() => {
		const param = /\@(\w+)/.exec(usernameParam)
		const usernameExec = param && param[1]
		
		usernameExec ? setUsernameQuery(usernameExec) : setRedirect('/error')
	}, [])
	
	useEffect(() => {
		const invalidProfile = binarySearch(invalidUsernames, usernameQuery) > -1
		console.log('list update')
		if (invalidProfile) return setRedirect('/error?e=no-user')
		
		const userId = idsByUsername[usernameQuery]
		
		if (
			(profileData !== null && profileList[userId] === profileData) || usernameQuery === null
		) return
		
		if (userId) {
			setProfileData(profileList[userId])
		} else if (!fetching) {
			setFetching(true)
			dispatch(getProfileFromUsername(usernameQuery))
		}
	}, [usernameQuery, profileList, invalidUsernames])
	
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
						{profileData.connection?.isSelf ? <button className="edit-profile btn-round btn-outline">
							Edit Profile
						</button> : <FollowButton
							following={profileData.connection.following}
							userId={profileData.userId}
						/>}
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
				</div>
			</div>
		</div>}
	</Layout>
}

export default Profile