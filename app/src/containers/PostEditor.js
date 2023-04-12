import React, { useRef, useState } from 'react'
import classNames from 'classnames'

import { Input, Icon } from '../components/UI/index.js'
import api from '../util/api.js'

const PostEditor = () => {
	const inputRef = useRef(null)
	const [saveReady, setSaveReady] = useState(false)
	const [valid, setValid] = useState(false)
	
	const handleSubmit = () => {
		if (!saveReady || !valid) return
		
		const body = inputRef.current.getValue()
		
		inputRef.current.setValue('')
		
		api.post('/v1/post/new', { body })
	}
	
	return <div className="post-editor">
		<label className="box">
			<Input
				ref={inputRef}
				handleValueChange={value => {
					setSaveReady(value.length > 0 && valid)
				}}
				handleValidity={setValid}
				type="textarea"
				placeholder="Write a new post..."
				displayError={false}
				minLength={1}
				maxLength={50}
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
						!valid && !saveReady && 'btn-disabled'
					)}
					onClick={handleSubmit}
				>Post</button>
			</div>
		</label>
	</div>
}

export default PostEditor