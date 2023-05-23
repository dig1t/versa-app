import React, { useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Navigate, useNavigate, useParams } from 'react-router-dom'
import PropTypes from 'prop-types'
import classNames from 'classnames'

import Layout from '../../Core/components/Layout.js'
import Loading from '../../Core/components/Loading.js'
import Avatar from './Avatar.js'
import Feed from '../../Content/components/Feed.js'
import { CatPills, Modal, Tooltip } from '../../../components/UI.js'
import {
	getProfileConnection,
	getProfileFromUsername
} from '../store/actions/profileActions.js'
import { binarySearch } from '../../../util/index.js'
import { defaultAssets } from '../../../constants/assets.js'
import { useAuthenticated } from '../../Auth/context/Auth.js'
import LinkInjector from '../../../components/LinkInjector.js'
import FollowButton from './FollowButton.js'
import DisplayName from './DisplayName.js'

const feedCategories = [
	{
		label: 'Posts',
		name: 'posts'
	},
	{
		label: 'Photos',
		name: 'photos'
	},
	{
		label: 'Videos',
		name: 'videos'
	}
]

const Profile = () => {
	const dispatch = useDispatch()
	const { profileList, idsByUsername, invalidUsernames } = useSelector((state) => ({
		profileList: state.profiles.profileList,
		idsByUsername: state.profiles.idsByUsername,
		invalidUsernames: state.profiles.invalidUsernames
	}))
	
	const navigate = useNavigate()
	const { loggedIn } = useAuthenticated()
	const { username } = useParams()
	const [profileData, setProfileData] = useState(null)
	const [usernameQuery, setUsernameQuery] = useState(null)
	const [redirect, setRedirect] = useState(null)
	const [fetching, setFetching] = useState(false)
	
	useEffect(() => {
		const param = /@(\w+)/.exec(username)
		const usernameExec = param && param[1]
		
		usernameExec ? setUsernameQuery(usernameExec) : setRedirect('/error')
	}, [])
	
	useEffect(() => {
		const invalidProfile = binarySearch(invalidUsernames, usernameQuery) > -1
		
		if (invalidProfile) return setRedirect('/error?e=no-user')
		
		const userId = idsByUsername[usernameQuery]
		
		if (
			(profileData !== null && profileList[userId] === profileData) || usernameQuery === null
		) return
		
		if (userId) {
			setProfileData(profileList[userId])
			
			if (!profileList[userId].connection && loggedIn) dispatch(
				getProfileConnection(userId)
			)
		} else if (!fetching) {
			setFetching(true)
			dispatch(getProfileFromUsername(usernameQuery))
		}
	}, [usernameQuery, profileList, invalidUsernames, profileData])
	
	return <Layout page="profile">
		{redirect && <Navigate to={redirect} />}
		{profileData === null ? <Loading /> : <div className="wrap grid-g">
			<div className="col-12">
				<div className="info box">
					<div className="banner">
						<Modal type="image" image={profileData.banner || defaultAssets.banner}>
							<div
								className="img"
								style={{
									backgroundImage: `url(${profileData.banner || defaultAssets.banner})`
								}}
							/>
						</Modal>
					</div>
					<div className="details">
						<div className="avatar-container">
							<Avatar
								userId={profileData.userId}
								useModal
								isCardAvatar
							/>
						</div>
						<div className="container">
							<DisplayName profile={profileData} username wrap />
							<div className="bio">
								<LinkInjector text={profileData?.bio} />
							</div>
							{profileData.website && <div className="website">
								<a
									href={'//' + profileData.website}
									target="_blank"
									rel="noopener noreferrer nofollow external"
									referrerPolicy="no-referrer"
								>
									{profileData.website}
								</a>
							</div>}
						</div>
						{profileData.connection && (profileData.connection.isSelf ? <button
							className="cta btn-round btn-outline"
							data-card-action="edit-profile"
							onClick={() => navigate('/settings/profile')}
						>
							Edit Profile
						</button> : <FollowButton
							following={profileData.connection.following}
							userId={profileData.userId}
						/>)}
					</div>
					<div className="community-stats grid">
						<div className="stat col-6">
							<Tooltip text={`${profileData.followers || 0} followers`}>
								<div className="value">{profileData.followers || 0}</div>
							</Tooltip>
							<div className="label">followers</div>
						</div>
						<div className="stat col-6">
							<Tooltip text={`${profileData.following || 0} following`}>
								<div className="value">{profileData.following || 0}</div>
							</Tooltip>
							<div className="label">following</div>
						</div>
					</div>
				</div>
			</div>
			<div className="col-12">
				<div className="feed box">
					<CatPills
						pills={feedCategories}
						defaultCategory={profileData.defaultCategory || 'posts'}
						squared
						handleSelection={(category) => {
							console.log('selected pill of type:', category.name)
						}}
					/>
					<Feed userId={profileData.userId} />
				</div>
			</div>
		</div>}
	</Layout>
}

export default Profile