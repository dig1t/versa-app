import React from 'react'
import { useDispatch } from 'react-redux'
import classNames from 'classnames'
import PropTypes from 'prop-types'

import { followProfile } from '../store/actions/profileActions.js'

const FollowButton = ({ userId, following }) => {
	const dispatch = useDispatch()
	
	const handleClick = (input) => {
		input.preventDefault()
		
		dispatch(followProfile(userId, !following))
	}
	
	return <button
		className={classNames(
			'cta btn-round btn-outline',
			following ? 'btn-secondary following' : 'not-following'
		)}
		data-card-action={following ? 'unfollow' : 'follow'}
		onClick={handleClick}
	>{
		following ? 'Unfollow' : 'Follow'
	}</button>
}

FollowButton.propTypes = {
	following: PropTypes.bool.isRequired,
	userId: PropTypes.string.isRequired
}

export default FollowButton