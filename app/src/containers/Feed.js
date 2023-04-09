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

const Feed = ({ type, userId }) => {
	const dispatch = useDispatch()
	const feed = useSelector(state => state.feed.posts)
	
	const [posts, setPosts] = useState([])
	const [fetching, setFetching] = useState(false)
	
	useEffect(() => {
		if (!fetching) {
			setFetching(true)
			
			switch(type) {
				case 'home':
					console.log('GET HOME FEED') // TODO: GET HOME FEED
					//dispatch()
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
		{posts.map(post => <Post key={post.postId} data={post} />)}
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