import React from 'react'

import Avatar from './Avatar'

const Post = ({ data }) => {
	
	return <div className="post">
		<div className="container">
			<div className="post-avatar">
				<Avatar img={data.profile.avatar} />
			</div>
			<div className="main">
				<div className="user">
					<span className="name">{data.profile.name}</span>
					<span className="username">{data.profile.username}</span>
					&bull;
					<span className="time">{data.created}</span>
				</div>
				<div className="content">
					{data.text && <div className="text">{data.text}</div>}
				</div>
			</div>
		</div>
	</div>
}

export default Post