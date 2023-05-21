import React from 'react'

import Avatar from './Avatar.js'
import DisplayName from './DisplayName.js'
import FollowButton from './FollowButton.js'
import { defaultAssets } from '../../../constants/assets.js'
import LinkInjector from '../../../containers/LinkInjector.js'

const ProfileCard = ({ profile, showCTA }) => {
	const connection = profile?.connection || {}
	const canMessage = connection.isMutualFollower &&
		!connection.isSelf &&
		!connection.blocked
	
	return profile && (<div className="profile-card">
		<div className="clearfix">
			<div className="banner">
				<div className="img" style={{
					backgroundImage: `url("${profile.banner || defaultAssets.banner}")`
				}} />
			</div>
			<div className="details">
				<div className="avatar-container">
					<Avatar userId={profile.userId} isCardAvatar />
				</div>
				<div className="container">
					<DisplayName profile={profile} username wrap />
					<div className="bio">
						<LinkInjector text={profile.bio} />
					</div>
					{profile.website && (
						<div className="website">
							<a
								href={'//' + profile.website}
								target="_blank"
								rel="noopener noreferrer nofollow external"
								referrerPolicy="no-referrer"
							>
								{profile.website}
							</a>
						</div>
					)}
				</div>
				{showCTA && (canMessage ? (
					<button
						className="cta btn-round btn-outline"
						data-card-action="message"
						onClick={() => console.log('NAV TO CHAT')}
					>
						Message
					</button>
				) : (
					!connection.isSelf && <FollowButton
						following={connection.following}
						userId={profile.userId}
					/>
				))}
				<button
					className="cta btn-round btn-outline"
					onClick={() => console.log('NAV TO CHAT')}
				>
					Message
				</button>
				<div className="community-stats">
					<div className="stat">
						<span className="value">{profile.followers}</span>
						<span className="label">followers</span>
					</div>
					<div className="stat">
						<span className="value">{profile.following}</span>
						<span className="label">following</span>
					</div>
				</div>
			</div>
		</div>
	</div>)
}

ProfileCard.defaultProps = {
	showCTA: true
}

export default ProfileCard