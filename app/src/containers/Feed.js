import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { useDispatch, useSelector } from 'react-redux'

import Post from './Post.js'
import Loading from '../components/Loading.js'
import { getProfileFeed, getHomeFeed } from '../actions/feed.js'

const Feed = ({ type, userId }) => {
	const dispatch = useDispatch()
	const feed = useSelector((state) => state.feed.posts)
	
	const [posts, setPosts] = useState([])
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
		setPosts(feed)
		
		if (fetching) setFetching(false)
	}, [feed])
	
	return <div className="list">
		{posts.map((post) => <Post key={post.postId} data={post} />)}
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