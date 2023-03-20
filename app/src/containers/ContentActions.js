import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Navigate } from 'react-router-dom'
import classNames from 'classnames'
import PropTypes from 'prop-types'

import { Icon } from '../components/UI/index.js'
import { addLike, deleteLike } from '../actions/content.js'

const ContentActions = props => {
	const dispatch = useDispatch()
	const [redirect, setRedirect] = useState(null)
	const profileList = useSelector(state => state.profiles.profileList)
	const contentProfile = profileList[props.userId]
	
	return <div className="actions">
		{redirect && <Navigate to={redirect} />}
		<div
			className={classNames(
				'action like align-center-wrap',
				props.liked && 'selected'
			)}
			onClick={input => {
				input.preventDefault()
				
				dispatch(
					props.liked ? deleteLike(props.contentId) : addLike(props.contentId)
				)
			}}
		>
			<Icon name="heart" />
			<span>{props.likes || 0}</span>
		</div>
		<div
			className="action comment align-center-wrap"
			onClick={input => {
				if (!contentProfile || props.noRedirect) return
				
				input.preventDefault()
				setRedirect(`/@${contentProfile.username}/${props.contentId}`)
			}}
		>
			<Icon name="comment" />
			<span>{props.comments || 0}</span>
		</div>
		<div className="action repost align-center-wrap">
			<Icon name="repost" />
			<span>{props.reposts || 0}</span>
		</div>
	</div>
}

ContentActions.propTypes = {
	contentId: PropTypes.string.isRequired,
	likes: PropTypes.number,
	comments: PropTypes.number,
	reposts: PropTypes.number,
	noRedirect: PropTypes.bool,
	liked: PropTypes.bool
}

export default ContentActions