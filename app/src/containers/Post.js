import React, { useCallback } from 'react'
import { formatDistance } from 'date-fns'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'

import Avatar from './Avatar.js'
import { Icon } from '../components/UI/index.js'

const PostMedia = ({ type, source }) => {
	// media: {
	// 	type: 'image',
	// 	source: 'https://via.placeholder.com/1500'
	// }
	
	const renderMedia = useCallback(() => {
		switch(type) {
			case 'album':
				return <div className="album-wrap">
					<div className="img img-fill" style={{
						backgroundImage: `url(${source})`
					}} />
				</div>
			case 'image':
				return <img src={source} />
		}
	}, [type])
	
	return <div className="media">
		{renderMedia()}
	</div>
}

PostMedia.propTypes = {
	type: PropTypes.string.isRequired,
	source: PropTypes.string.isRequired
}

const Post = ({ data }) => {
	const timePosted = formatDistance(
		new Date(data.created),
		new Date(),
		{ addSuffix: true, includeSeconds: true }
	)
	
	return <div className="post" data-id={data.postId}>
		<div className="container">
			<div className="post-avatar">
				<Avatar img={data.profile.avatar} />
			</div>
			<div className="main">
				<div className="details">
					<span className="name align-center-wrap">
						<Link
							to={`/@${data.profile.username}`}
							className="unstyled-link"
						>
							{data.profile.name}
						</Link>
						<Icon
							svg
							name="verified"
							hidden={!data.profile.verificationLevel || data.profile.verificationLevel === 0}
						/>
					</span>
					<span className="username">@{data.profile.username}</span>
					<span>&bull;</span>
					<span className="time">{timePosted}</span>
					<div className="options"><Icon name="ellipsis" /></div>
				</div>
				<div className="content">
					{data.text && <div className="text">{data.text}</div>}
					{data.media && <PostMedia {...data.media} />}
				</div>
				<div className="actions">
					<div className="action likes selected align-center-wrap">
						<Icon name="heart" />
						<span>{data.likes}</span>
					</div>
					<div className="action comments align-center-wrap">
						<Icon name="comment" />
						<span>{data.comments}</span>
					</div>
					<div className="action likes align-center-wrap">
						<Icon name="repost" />
						<span>{data.reposts}</span>
					</div>
				</div>
			</div>
		</div>
	</div>
}

export default Post