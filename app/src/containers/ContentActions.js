import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Navigate } from 'react-router-dom'
import classNames from 'classnames'
import PropTypes from 'prop-types'

import { Icon } from '../components/UI/index.js'
import { addLike, deleteLike } from '../actions/content.js'
import { useAuthenticated } from '../context/Auth.js'

const ContentActions = ({ data, noRedirect }) => {
	const dispatch = useDispatch()
	const { loggedIn } = useAuthenticated()
	const [redirect, setRedirect] = useState(null)
	const profileList = useSelector((state) => state.profiles.profileList)
	const contentProfile = profileList[data.userId]
	
	return <div className="actions">
		{redirect && <Navigate to={redirect} />}
		<div
			className={classNames(
				'action like align-center-wrap',
				data.liked && 'selected',
				loggedIn !== true && 'disabled'
			)}
			onClick={(input) => {
				input.preventDefault()
				
				if (loggedIn !== true) return
				
				dispatch(
					data.liked ? deleteLike(data.contentId) : addLike(data.contentId)
				)
			}}
		>
			<Icon name="heart" />
			<span>{data.likes || 0}</span>
		</div>
		<div
			className="action comment align-center-wrap"
			onClick={(input) => {
				if (!contentProfile || noRedirect) return
				
				input.preventDefault()
				setRedirect(`/@${contentProfile.username}/${data.contentId}`)
			}}
		>
			<Icon name="comment" />
			<span>{data.comments || 0}</span>
		</div>
		<div
			className={classNames(
				'action repost align-center-wrap',
				loggedIn !== true && 'disabled'
			)}
			onClick={(input) => {
				input.preventDefault()
				
				if (loggedIn !== true) return
				
				console.log('TODO: implement reposts')
			}}
		>
			<Icon name="repost" />
			<span>{data.reposts || 0}</span>
		</div>
	</div>
}

ContentActions.propTypes = {
	noRedirect: PropTypes.bool
}

export default ContentActions