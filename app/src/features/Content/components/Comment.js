import React, { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { format, formatDistanceToNowStrict } from 'date-fns'
import PropTypes from 'prop-types'

import { Tooltip } from '../../../components/UI.js'
import Avatar from '../../User/components/Avatar.js'
import LinkInjector from '../../../containers/LinkInjector.js'
import DisplayName from '../../User/components/DisplayName.js'
import useProfile from '../../User/hooks/useProfile.js'

const Comment = ({ data }) => {
	const profile = useProfile(data.userId)
	
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
	
	return <div className="post comment">
		<div className="container">
			<div className="post-avatar">
				<Avatar avatar={profile.avatar} />
			</div>
			<div className="main">
				<div className="details">
					<DisplayName profile={profile} linked />
					<span className="username"><Link
						to={`/@${profile.username}`}
						className="unstyled-link"
					>
						@{profile.username}
					</Link></span>
					<span>&bull;</span>
					<span className="time">
						<Tooltip text={dateCreated}>{timeAgoCreated}</Tooltip>
					</span>
				</div>
				<div className="content">
					<div className="text">
						<LinkInjector text={data?.body} />
					</div>
				</div>
			</div>
		</div>
	</div>
}

Comment.propTypes = {
	data: PropTypes.object.isRequired
}

export default Comment