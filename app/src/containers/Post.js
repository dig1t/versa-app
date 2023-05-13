import React, { useMemo } from 'react'
import { format, formatDistanceToNowStrict } from 'date-fns'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux'

import Avatar from '../features/User/components/Avatar.js'
import { Icon, Tooltip } from '../components/UI/index.js'
import { VerifiedBadge } from '../features/User/components/VerifiedBadge.js'
import ContentMedia from './ContentMedia.js'
import ContentActions from './ContentActions.js'
import LinkInjector from './LinkInjector.js'

const Post = ({ data }) => {
	const { profileList, contentList } = useSelector((state) => ({
		profileList: state.profiles.profileList,
		contentList: state.content.contentList
	}))
	
	const content = contentList[data.contentId]
	const contentProfile = content ? profileList[content.userId] : {}
	
	const { timeAgoCreated, dateCreated } = useMemo(() => {
		const dateInstance = new Date(data.created)
		
		return {
			timeAgoCreated: formatDistanceToNowStrict(
				dateInstance,
				{ addSuffix: true, includeSeconds: true }
			),
			dateCreated: format(
				dateInstance,
				'PPpp'
			)
		}
	}, [data.created])
	
	return <div className="post" data-id={data.postId}>
		<div className="container">
			<div className="post-avatar">
				<Avatar userId={contentProfile.userId} />
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
						<Tooltip text={dateCreated}>{timeAgoCreated}</Tooltip>
					</Link></span>
					<div className="options"><Icon name="ellipsis" /></div>
				</div>
				<div className="content">
					{content.body && <div className="text">
						<LinkInjector text={content?.body} />
					</div>}
					{content.media && <ContentMedia {...content.media} />}
				</div>
				<ContentActions data={content} />
			</div>
		</div>
	</div>
}

Post.propTypes = {
	data: PropTypes.object.isRequired
}

export default Post