import React from 'react'

import Post from './Post.js'

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
	const posts = fakeData
	let ii = 0
	return <div className="list">
		{posts.map(post => {
			ii++
			
			return <Post data={post} key={post.contentId + ii} />
		})}
	</div>
}

export default Feed