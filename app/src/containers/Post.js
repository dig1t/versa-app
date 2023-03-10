import React, { useCallback } from 'react'
import { formatDistance } from 'date-fns'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux'

import Avatar from './Avatar.js'
import { Icon } from '../components/UI/index.js'
import { VerifiedBadge } from './VerifiedBadge.js'
import ContentMedia from './ContentMedia.js'

const Post = ({ data }) => {
	const profileList = useSelector(state => state.profiles.profileList)
	
	const timePosted = formatDistance(
		new Date(data.created),
		new Date(),
		{ addSuffix: true, includeSeconds: true }
	)
	
	const contentProfile = profileList[data.content.userId]
	
	return <div className="post" data-id={data.postId}>
		<div className="container">
			<div className="post-avatar">
				<Avatar avatar={contentProfile.avatar} />
			</div>
			<div className="main">
				<div className="details">
					<span className="name align-center-wrap">
						<Link
							to={`/@${contentProfile.username}`}
							className="unstyled-link"
						>
							{contentProfile.name}
						</Link>
						<VerifiedBadge verificationLevel={contentProfile.verificationLevel} />
					</span>
					<span className="username"><Link
						to={`/@${contentProfile.username}`}
						className="unstyled-link"
					>
						@{contentProfile.username}
					</Link></span>
					<span>&bull;</span>
					<span className="time"><Link
						to={`/@${contentProfile.username}/${data.content.contentId}`}
						className="unstyled-link"
					>
						{timePosted}
					</Link></span>
					<div className="options"><Icon name="ellipsis" /></div>
				</div>
				<div className="content">
					{data.content.body && <div className="text">{data.content.body}</div>}
					{data.content.media && <ContentMedia {...data.content.media} />}
				</div>
				<div className="actions">
					<div className="action likes align-center-wrap">
						<Icon name="heart" />
						<span>{data.content.likes || 0}</span>
					</div>
					<div className="action comments align-center-wrap">
						<Icon name="comment" />
						<span>{data.content.comments || 0}</span>
					</div>
					<div className="action likes align-center-wrap">
						<Icon name="repost" />
						<span>{data.content.reposts || 0}</span>
					</div>
				</div>
			</div>
		</div>
	</div>
}

export default Post