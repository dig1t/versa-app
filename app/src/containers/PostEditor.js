import React, { useState } from 'react'

import { Input, Icon } from '../components/UI/index.js'

const PostEditor = () => {
	const [text, setText] = useState('')
	
	return <div className="post-editor">
		<label className="box">
			<Input
				handleValueChange={value => setText(value)}
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
				<button className="btn btn-round btn-primary post">Post</button>
			</div>
		</label>
	</div>
}

export default PostEditor