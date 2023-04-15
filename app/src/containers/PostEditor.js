import React, { useRef, useState } from 'react'
import classNames from 'classnames'

import { Input, Icon } from '../components/UI/index.js'
import api from '../util/api.js'
import { newFeedPost } from '../actions/feed.js'
import { useDispatch } from 'react-redux'

const PostEditor = () => {
	const dispatch = useDispatch()
	
	const inputRef = useRef(null)
	const [valid, setValid] = useState(false)
	
	const handleSubmit = () => {
		const body = inputRef.current.getValue()
		
		inputRef.current.setValue('')
		
		api.post('/v1/post/new', { body })
			.then(response => dispatch(newFeedPost(response)))
	}
	
	return <div className="post-editor">
		<label className="box">
			<Input
				ref={inputRef}
				handleValidity={setValid}
				type="textarea"
				placeholder="Write a new post..."
				displayError={false}
				minLength={1}
				maxLength={512}
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
						!valid && 'btn-disabled'
					)}
					onClick={handleSubmit}
				>Post</button>
			</div>
		</label>
	</div>
}

export default PostEditor