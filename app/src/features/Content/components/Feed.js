import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { useDispatch, useSelector } from 'react-redux'

import Post from './Post.js'
import Loading from '../../Core/components/Loading.js'
import { getProfileFeed, getHomeFeed } from '../store/actions/feedActions.js'

const Feed = ({ type, userId }) => {
	const dispatch = useDispatch()
	const feed = useSelector((state) => state.feed)

	const [fetching, setFetching] = useState(false)

	useEffect(() => {
		if (!fetching) {
			setFetching(true)

			switch(type) {
				case 'home':
					// TODO: GET HOME FEED
					dispatch(getHomeFeed())
					break
				case 'profile':
					dispatch(getProfileFeed(userId, type))
					break
			}
		}
	}, [])

	useEffect(() => {
		if (fetching) setFetching(false)
	}, [feed.posts])

	return <div className="list">
		{feed.posts.map((post) => <Post key={post.postId} data={post} />)}
		{fetching && <Loading />}
	</div>
}

Feed.defaultProps = {
	type: 'profile',
	category: 'all'
}

Feed.propTypes = {
	userId: PropTypes.string,
	type: PropTypes.string,
	category: PropTypes.string
}

export default Feed
