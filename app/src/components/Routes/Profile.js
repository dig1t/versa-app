import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'

import Layout from '../Layout'
import Loading from '../Loading'
import Avatar from '../../containers/Avatar'
import Post from '../../containers/Post'
import Icon from '../UI/Icon'

const posts = [
	{
		postId: '2313214r34r2',
		contentId: 'rw4fe3re3wf4re43fu',
		text: 't5grtg5r4e45rtgrfegt4etf',
		media: {
			type: 'image',
			source: 'https://via.placeholder.com/1500'
		},
		profile: {
			userId: 'r34tef4r3efr3fe',
			username: 'dig1t',
			name: 'digit',
			verificationLevel: 1
		},
		reposts: 12,
		likes: 123,
		comments: 1,
		created: '2023-01-08T03:48:30.011+00:00'
	}
]

const ProfileFeed = props => {
	
	
	return <>
		<div className="navigation">
			<div className="option selected">Posts</div>
			<div className="option">Media</div>
			<div className="option">Likes</div>
		</div>
		<div className="list">
			{posts.map(post => {
				return <Post data={post} key={post.contentId} />
			})}
		</div>
	</>
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
	//const [isFriend, setIsFriend] = useState(false)
	
	useEffect(() => {
		const param = /\@(\w+)/.exec(usernameParam)
		const usernameExec = param && param[1]
		
		usernameExec && setUsernameQuery(usernameExec)
	}, [])
	
	useEffect(() => {
		const profile = profileList.find(data => data.username === usernameQuery)
		
		if (profile && profile.username === usernameQuery) {
			setIsUserProfile(profile.username === username)
			setProfileData(profile)
		}
	}, [usernameQuery, profileList])
	
	return <Layout page="profile">
		{profileData === null ? <Loading /> : <div className="wrap grid">
			<div className="info box col-12 col-desktop-4">
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
			<div className="feed box col-12 col-desktop-8">
				<ProfileFeed />
			</div>
		</div>}
	</Layout>
}

export default Profile