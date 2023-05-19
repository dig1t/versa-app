import React, { useMemo } from 'react'
import { format, formatDistanceToNowStrict } from 'date-fns'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux'
import classNames from 'classnames'

import Avatar from '../../User/components/Avatar.js'
import { Icon, Tooltip } from '../../../components/UI.js'
import ContentMedia from './ContentMedia.js'
import ContentActions from './ContentActions.js'
import LinkInjector from '../../../containers/LinkInjector.js'
import DisplayName from '../../User/components/DisplayName.js'

const getTextSize = (text) => {
	if (text.length > 20) {
		return 'text-large'
	} else if (text.length > 10) {
		return 'text-medium'
	}
}

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
					<DisplayName profile={contentProfile} linked />
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
					{content.body && <div className={classNames(
						'text',
						getTextSize(content.body || ''),
					)}>
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