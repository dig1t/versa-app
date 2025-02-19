import React, { useEffect, useRef, useState } from 'react'
import classNames from 'classnames'
import { useDispatch } from 'react-redux'

import api from '../../../util/api.js'
import { Input, Icon } from '../../../components/UI.js'
import { newFeedPost } from '../store/actions/feedActions.js'
import Avatar from '../../User/components/Avatar.js'
import DisplayName from '../../User/components/DisplayName.js'
import FileUploader, { FilePreviewer } from './FileUploader.js'
import useProfile from '../../User/hooks/useProfile.js'

const PostEditor = () => {
	const dispatch = useDispatch()

	const inputRef = useRef(null)
	const uploaderRef = useRef(null)
	const [textValid, setTextValid] = useState(false)
	const [files, setFiles] = useState([])
	const [filesReady, setFilesReady] = useState(true)
	const [uploadReady, setUploadReady] = useState(false)
	const profile = useProfile(true)

	useEffect(() => setUploadReady(
		(filesReady && textValid) ||
		(inputRef.current.getValue().length === 0 && filesReady && files.length > 0)
	), [filesReady, textValid])

	const handleSubmit = () => {
		if (!uploadReady) return

		const body = inputRef.current.getValue()

		inputRef.current.setValue('')
		console.log(files.map((file) => file.media.mediaId))
		api.post('/v1/post/new', {
			body,
			media: files.map((file) => file.media.mediaId)
		})
			.then((response) => dispatch(newFeedPost(response)))
			.catch((error) => {
				// TODO: CONVERT TO TOAST NOTIFICATION
				console.log(error)
				console.warn('Error posting comment')
			})
	}

	return <div className="post-editor">
		<label className="box">
			<div className="post-header">
				{profile && <>
					<Avatar userId={profile.userId} />
					<DisplayName profile={profile} />
				</>}
			</div>
			<Input
				ref={inputRef}
				handleValidity={setTextValid}
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
						!uploadReady && 'btn-disabled'
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
