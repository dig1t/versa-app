import classNames from 'classnames'
import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'

import { getProfile } from '../actions/profile.js'
import { defaultAssets } from '../constants/assets.js'

const ActivityCircle = () => <svg version="1.1" x="0" y="0" viewBox="0 0 50 50">
	<path d="M25,1c13.2,0,24,10.8,24,24S38.2,49,25,49S1,38.2,1,25S11.8,1,25,1 M25,0C11.2,0,0,11.2,0,25s11.2,25,25,25s25-11.2,25-25
		S38.8,0,25,0L25,0z"/>
</svg>
	
const RenderLink = ({ clickRedirect, profile, children }) => <>
	{clickRedirect && profile && profile.username ? <Link to={`/@${profile.username}`}>
		{children}
	</Link> : children}
</>

const Avatar = props => {
	const dispatch = useDispatch()
	const { profileList } = useSelector(state => ({
		profileList: state.profiles.profileList
	}))
	
	const { avatar, status, hasStory, userId, clickRedirect } = props
	
	const [avatarImg, setAvatarImg] = useState()
	const [fetching, setFetching] = useState(false)
	const [profile, setProfile] = useState()
	
	useEffect(() => {
		if (profile || avatarImg) return
		
		if (avatar) {
			setAvatarImg(avatar)
			return
		}
		
		const profileFetch = profileList[userId]
		
		console.log(profileList, userId, profileFetch)
		if (profileFetch) {
			console.log('asdjsaid')
			setProfile(profileFetch)
			setAvatarImg(profileFetch.avatar || defaultAssets.avatar)
		} else if (typeof userId !== 'undefined' && !fetching) {
			console.log('FETCH PROFILE')
			setFetching(true)
			dispatch(getProfile(userId))
		}
		console.log('avatar', profile)
	}, [profileList, fetching])
	
	return <div
		className={classNames(
			'avatar', !hasStory && 'has-story'
		)}
	>
		<div className="push" />
		<div className="avatar-wrap">
			<div className="border">
				<RenderLink clickRedirect={clickRedirect} profile={profile}>
					<div className="img" style={{
						backgroundImage: `url(${avatarImg || defaultAssets.avatar})`
					}} />
					{status && <div className={classNames(
						'activity-status', status
					)} />}
					<ActivityCircle />
				</RenderLink>
			</div>
		</div>
	</div>
}

/*
				<div className="avatar">
					<div className="push" />
					<div className="avatar-wrap">
						<div className="img" style={{
							backgroundImage: `url(${defaultAssets.avatar})`
						}} />
						<div className="activity-status online" />
					</div>
				</div>
*/

export default Avatar