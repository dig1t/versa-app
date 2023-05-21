import React, { useMemo } from 'react'
import { format, formatDistanceToNowStrict } from 'date-fns'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux'
import classNames from 'classnames'

import Avatar from '../../User/components/Avatar.js'
import { Icon, Tooltip } from '../../../components/UI.js'
import DropMenu, { ItemMenu, MenuLink, MenuItem, MenuDivider } from '../../../components/DropMenu.js'
import ContentMedia from './ContentMedia.js'
import ContentActions from './ContentActions.js'
import LinkInjector from '../../../containers/LinkInjector.js'
import DisplayName from '../../User/components/DisplayName.js'
import { useAuthenticated } from '../../../context/Auth.js'

const getTextSize = (text) => {
	if (text.length < 32) {
		return 'text-medium'
	} else if (text.length < 16) {
		return 'text-large'
	}
}

const Post = ({ data }) => {
	const { userId } = useAuthenticated()
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
	
	const OptionsMenu = <ItemMenu>
		{content.userId === userId && (
			<MenuItem onClick={() => console.log('clicked')}>fsaddf</MenuItem>
		)}
		<MenuDivider />
		<MenuLink link="/settings">Settings</MenuLink>
		
		<li>
			dd
		</li>
	</ItemMenu>
	
	return <div className="post" data-id={data.postId}>
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
						<DropMenu menu={OptionsMenu} position="left">
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