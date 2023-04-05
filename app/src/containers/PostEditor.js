import React, { useEffect, useState } from 'react'
import classNames from 'classnames'

import { Input, Icon } from '../components/UI/index.js'
import api from '../util/api.js'

const PostEditor = () => {
	const [data, setData] = useState({
		text: ''
	})
	const [saveReady, setSaveReady] = useState(false)
	
	useEffect(() => setSaveReady(data.text.length > 0), [data])
	
	const handleSubmit = event => {
		if (!saveReady) return
		
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
					className={classNames(
						'btn btn-round btn-primary post',
						!saveReady && 'btn-disabled'
					)}
					onClick={handleSubmit}
				>Post</button>
			</div>
		</label>
	</div>
}

export default PostEditor