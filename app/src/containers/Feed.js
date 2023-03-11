import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { useDispatch, useSelector } from 'react-redux'

import Post from './Post.js'
import Loading from '../components/Loading.js'
import { getProfileFeed } from '../actions/feed.js'

const fakeData = [ // TODO: REPLACE PSUEDO DATA
	{
		postId: '2313214r34r2',
		contentId: 'rw4fe3re3wf4re43fu',
		text: 't5grtg5r4e45rtgrfegt4etf',
		media: {
			type: 'image',
			source: 'https://via.placeholder.com/1500'
		},
		profile: {
			userId: 'r34tef4r3efr3fe',
			username: 'dig1t',
			name: 'digit',
			verificationLevel: 1
		},
		reposts: 12,
		likes: 123,
		comments: 1,
		created: '2023-01-08T03:48:30.011+00:00'
	}
]

const Feed = props => {
	const dispatch = useDispatch()
	const feed = useSelector(state => state.feed.posts)
	
	const [posts, setPosts] = useState([])
	const [fetching, setFetching] = useState(false)
	
	useEffect(() => {
		if (!fetching) {
			setFetching(true)
			dispatch(getProfileFeed(props.userId, props.feedType))
		}
	}, [])
	
	useEffect(() => {
		setPosts(feed)
		
		if (fetching) setFetching(false)
	}, [feed])
	
	return <div className="list">
		{posts.map(post => <Post key={post.postId} {...post} />)}
		{fetching && <Loading />}
	</div>
}

Feed.propTypes = {
	userId: PropTypes.string.isRequired
}

export default Feed