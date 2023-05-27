import React, { useEffect, useMemo } from 'react'
import { format, formatDistanceToNowStrict } from 'date-fns'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux'
import classNames from 'classnames'

import Avatar from '../../User/components/Avatar.js'
import { Icon, Tooltip } from '../../../components/UI.js'
import DropMenu from '../../../components/DropMenu.js'
import ContentMedia from './ContentMedia.js'
import ContentActions from './ContentActions.js'
import LinkInjector from '../../../components/LinkInjector.js'
import DisplayName from '../../User/components/DisplayName.js'
import PostDropMenu from './PostDropMenu.js'

const getTextSize = (text) => {
	if (text.length < 32) {
		return 'text-medium'
	} else if (text.length < 16) {
		return 'text-large'
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
	
	return <div className="post" data-postId={data.postId}>
		<div className="container">
			<div className="post-avatar">
				<Avatar userId={contentProfile.userId} />
			</div>
			<div className="main">
				<div className="details">
					<DisplayName profile={contentProfile} username linked />
					<span>&bull;</span>
					<span className="time"><Link
						to={`/@${contentProfile.username}/${content.contentId}`}
						className="unstyled-link"
					>
						<Tooltip text={dateCreated}>{timeAgoCreated}</Tooltip>
					</Link></span>
					<div className="options">
						<DropMenu
							menu={<PostDropMenu
								contentProfile={contentProfile}
								content={content}
								postId={data.postId}
							/>}
							position="left"
						>
							<Icon name="ellipsis" />
						</DropMenu>
					</div>
				</div>
				<div className="content">
					{content.body && <div className={classNames(
						'text',
						getTextSize(content.body || ''),
					)}>
						<LinkInjector text={content?.body} />
					</div>}
					{content.media && content.media.map(
						(media) => <ContentMedia
							key={`media-${media.mediaId}`}
							{...media}
						/>
					)}
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