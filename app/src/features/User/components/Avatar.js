import classNames from 'classnames'
import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import PropTypes from 'prop-types'

import { defaultAssets } from '../../../constants/assets.js'
import { Modal } from '../../../components/UI.js'
import useProfile from '../hooks/useProfile.js'

const activityTypeColors = {
	story: 'var(--blue)'
}

const ActivityCircle = ({ type }) => <svg
	version="1.1"
	x="0"
	y="0"
	viewBox="0 0 50 50"
	style={{
		fill: activityTypeColors[type] || '#000'
	}}
>
	<path d="M25,1c13.2,0,24,10.8,24,24S38.2,49,25,49S1,38.2,1,25S11.8,1,25,1 M25,0C11.2,0,0,11.2,0,25s11.2,25,25,25s25-11.2,25-25
		S38.8,0,25,0L25,0z"/>
</svg>

ActivityCircle.defaultProps = {
	type: 'story'
}

const RenderLink = ({ clickRedirect, profile, children }) => <>
	{clickRedirect && profile && profile.username ? <Link to={`/@${profile.username}`}>
		{children}
	</Link> : children}
</>

const Avatar = ({
	avatar,
	status,
	hasStory,
	isCardAvatar,
	userId,
	clickRedirect,
	useModal
}) => {
	const [avatarImg, setAvatarImg] = useState(avatar || defaultAssets.avatar)
	const profile = useProfile(userId)

	useEffect(() => {
		if (profile?.avatar && avatar === undefined) {
			setAvatarImg(profile.avatar)
		}
	}, [profile])

	const ModalComponent = React.memo(({ children }) => {
		return useModal ? <Modal type="image" image={avatarImg}>
			{children}
		</Modal> : <>{children}</>
	}, [useModal])

	return <div
		className={classNames(
			'avatar', !hasStory && 'has-story'
		)}
	>
		<div className="push" />
		<div className="avatar-wrap">
			<ModalComponent>
				<div className={classNames(
					'border',
					isCardAvatar && 'avatar-card'
				)}>
					<RenderLink clickRedirect={clickRedirect} profile={profile}>
						<div className="img" style={{
							backgroundImage: `url(${avatarImg})`
						}} />
						{status && <div className={classNames(
							'activity-status', status
						)} />}
						{hasStory && <ActivityCircle type="story" />}
					</RenderLink>
				</div>
			</ModalComponent>
		</div>
	</div>
}

Avatar.defaultProps = {
	hasStory: false,
	isCardAvatar: false,
	clickRedirect: false,
	useModal: false
}

Avatar.propTypes = {
	avatar: PropTypes.string,
	status: PropTypes.string,
	hasStory: PropTypes.bool,
	isCardAvatar: PropTypes.bool,
	userId: PropTypes.string,
	clickRedirect: PropTypes.bool,
	useModal: PropTypes.bool
}

export default Avatar
