import React, { useEffect, useState } from 'react'

import { Input, Icon } from '../components/UI/index.js'
import api from '../util/api.js'

const PostEditor = () => {
	const [data, setData] = useState({
		text: ''
	})
	
	useEffect(() => {
		console.log(data)
	}, [data])
	
	const handleSubmit = event => {
		const body = data.text
		
		setData({ text: '' })
		
		api.post('/v1/post/new', { body })
	}
	
	return <div className="post-editor">
		<label className="box">
			<Input
				handleValueChange={value => setData({ text: value })}
				value={data.text}
				type="textarea"
				placeholder="Write a status..."
				displayError={false}
			/>
			<div className="editor-controls">
				<div className="attachments center-wrap">
					<div className="photo">
						<Icon name="photo" />
					</div>
				</div>
				<button
					className="btn btn-round btn-primary post"
					onClick={handleSubmit}
				>Post</button>
			</div>
		</label>
	</div>
}

export default PostEditor