import React, { useCallback } from 'react'
import { formatDistance } from 'date-fns'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux'

import Avatar from './Avatar.js'
import { Icon } from '../components/UI/index.js'
import { VerifiedBadge } from './VerifiedBadge.js'
import ContentMedia from './ContentMedia.js'
import ContentActions from './ContentActions.js'

const Post = props => {
	const { profileList, contentList } = useSelector(state => ({
		profileList: state.profiles.profileList,
		contentList: state.content.contentList
	}))
	
	const content = contentList[props.contentId]
	const contentProfile = profileList[content.userId]
	
	const timePosted = formatDistance(
		new Date(props.created),
		new Date(),
		{ addSuffix: true, includeSeconds: true }
	)
	
	return <div className="post" data-id={props.postId}>
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
						to={`/@${contentProfile.username}/${content.contentId}`}
						className="unstyled-link"
					>
						{timePosted}
					</Link></span>
					<div className="options"><Icon name="ellipsis" /></div>
				</div>
				<div className="content">
					{content.body && <div className="text">{content.body}</div>}
					{content.media && <ContentMedia {...content.media} />}
				</div>
				<ContentActions {...content} />
			</div>
		</div>
	</div>
}

export default Post