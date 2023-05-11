import React, { useRef, useState } from 'react'
import classNames from 'classnames'

import { Input, Icon } from '../components/UI/index.js'
import api from '../util/api.js'
import { newFeedPost } from '../actions/feed.js'
import { useDispatch } from 'react-redux'

import FileUploader, { FilePreviewer } from './FileUploader.js'

const PostEditor = () => {
	const dispatch = useDispatch()
	
	const inputRef = useRef(null)
	const uploaderRef = useRef(null)
	const [valid, setValid] = useState(false)
	const [files, setFiles] = useState([])
	const [filesReady, setFilesReady] = useState(true)
	
	const handleSubmit = () => {
		if (!valid || !filesReady) return
		
		const body = inputRef.current.getValue()
		
		inputRef.current.setValue('')
		
		api.post('/v1/post/new', { body })
			.then((response) => dispatch(newFeedPost(response)))
			.catch((error) => console.log(error)) // TODO: CONVERT TO TOAST NOTIFICATION
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
					<FileUploader
						ref={uploaderRef}
						handleChange={(newFiles) => setFiles(newFiles)}
						handleReadyStateChange={(ready) => {
							console.log(ready)
							setFilesReady(ready)
						}}
						showPreviews={false}
					>
						<Icon name="photo" />
					</FileUploader>
				</div>
				<button
					className={classNames(
						'btn btn-round btn-primary post',
						!valid && !filesReady && 'btn-disabled'
					)}
					onClick={handleSubmit}
				>Post</button>
			</div>
			{uploaderRef && <FilePreviewer
				files={files}
				handleRemove={(fileId) => {
					console.log('remove fileid', fileId, uploaderRef)
					uploaderRef.current.removeFileId(fileId)
				}}
			/>}
		</label>
	</div>
}

export default PostEditor