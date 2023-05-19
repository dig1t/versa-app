import React from 'react'

import Avatar from './Avatar.js'
import DisplayName from './DisplayName.js'

const ProfileCard = ({ profileData }) => {
	return <div className="profile-card">
		<div className="profile-card-header">
			<div className="profile-card-header-wrap">
				<div className="profile-card-header-avatar">
					<Avatar userId={profileData.userId} />
				</div>
			</div>
		</div>
		<div className="profile-card-body">
			<div className="profile-card-body-wrap">
				<div className="profile-card-body-name">
					<DisplayName profile={profileData} />
				</div>
				<div className="profile-card-body-username">
					@{profileData.username}
				</div>
				<div className="profile-card-body-bio">
					{profileData.bio}
				</div>
			</div>
		</div>
	</div>
}

export default ProfileCard