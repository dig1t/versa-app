/* eslint-disable no-undef */
import classNames from 'classnames'
import React, { useCallback, useEffect, forwardRef, useImperativeHandle, useRef, useState } from 'react'
import PropTypes from 'prop-types'
import { v4 as uuidv4 } from 'uuid'

import api from '../../../util/api.js'
import Icon from '../../../components/Icon.js'
import { Tooltip } from '../../../components/UI.js'

const MAX_FILE_SIZE_MB = 20
const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
const ALLOWED_VIDEO_TYPES = ['video/mp4', 'video/quicktime']
const ALLOWED_AUDIO_TYPES = ['audio/mpeg', 'audio/wav']

const formatFiles = (files) => files.map(file => file.media)

const FilePreview = ({ fileData, onRemove }) => {
	const [rawImage, setRawImage] = useState(null)
	const [fileType, setFileType] = useState('unknown')
	
	const handleRemove = () => onRemove(fileData.fileId)
	
	const loadImagePreview = (file) => {
		const reader = new FileReader()
		
		reader.onload = (event) => {
			setRawImage(event.target.result)
		}
		
		reader.readAsDataURL(file)
	}
	
	useEffect(() => {
		if (ALLOWED_IMAGE_TYPES.includes(fileData.file.type)) {
			loadImagePreview(fileData.file)
			setFileType('image')
		} else if (ALLOWED_VIDEO_TYPES.includes(fileData.file.type)) {
			setFileType('video')
		} else if (ALLOWED_AUDIO_TYPES.includes(fileData.file.type)) {
			setFileType('audio')
		} else {
			setFileType('unknown')
		}
	}, [fileData])
	
	const renderPreview = useCallback(() => {
		switch(fileType) {
			case 'image': {
				return <img src={rawImage} alt={fileData.file.name} onClick={handleRemove} />
			}
			case 'video': {
				return (
					<video onClick={handleRemove}>
						<source src={URL.createObjectURL(fileData.file)} type={fileData.file.type} />
						Your browser does not support the video tag.
					</video>
				)
			}
			case 'audio': {
				return <div className="audio-preview" onClick={handleRemove}>
					<div className="wrap">
						<Icon name="waveform" />
						<div className="file-name">{fileData.file.name}</div>
					</div>
				</div>
			}
		}
	}, [fileData, fileType, handleRemove, rawImage])
	
	return (
		<div className={classNames(
			'upload-preview',
			`upload-type-${fileType}`
		)}>
			{renderPreview()}
			<Icon
				name="close"
				wrap={true}
				onClick={handleRemove}
			/>
		</div>
	)
}

const FilePreviewer = ({ files, handleRemove }) => <div className="media-upload media-upload-previews">
	{files.map((fileData, index) => <FilePreview
		fileData={fileData}
		key={fileData.file.name + index}
		onRemove={handleRemove}
	/>)}
</div>

FilePreviewer.propTypes = {
	files: PropTypes.array.isRequired,
	handleRemove: PropTypes.func.isRequired
}

const FileUploader = forwardRef(({
	children,
	acceptedTypes,
	handleChange,
	handleReadyStateChange,
	showPreviews
}, ref) => {
	const [files, setFiles] = useState([])
	const inputRef = useRef(null)
	
	const validate = () => {
		// Set ready to true if all files are ready or there are no files
		const isReady = files.every(file => file.ready === true) || files.length === 0
		
		handleReadyStateChange(isReady)
	}
	
	const handleRemove = (fileId) => {
		// Abort any ongoing requests for removed files
		const ongoingRequest = files.find(file => file.fileId === fileId)?.abortController
		
		ongoingRequest?.abort()
		
		setFiles((prevFiles) => prevFiles.filter((file) => file.fileId !== fileId))
	}
	
	useImperativeHandle(ref, () => ({
		removeFileId: (fileId) => handleRemove(fileId)
	}))
	
	useEffect(() => {
		handleChange(files)
		validate()
	}, [files])
	
	// Abort any ongoing requests when the component unmounts
	useEffect(() => {
		return () => files.map((fileData) => {
			fileData.abortController.abort()
		})
	}, [])
	
	const useFileUpload = (file) => {
		const fileId = uuidv4()
		const data = new FormData()
		const abortController = new AbortController()
		
		data.append('file', file)
		
		const request = api.post('/v1/media/upload', data, {
			signal: abortController.signal,
			headers: {
				'Content-Type': `multipart/form-data; boundary=${data._boudary}`
			},
			onUploadProgress: (progressEvent) => {
				console.log(progressEvent)
				const progress = Math.round(
					(progressEvent.loaded / progressEvent.total) * 100
				)
				
				setFiles((prevState) => prevState.map(file => {
					if (file.fileId === fileId) {
						return {
							...file,
							progress
						}
					}
					
					return file
				}))
			}
		})
			.then((media) => {
				console.log('MEDIA READY', media)
				setFiles((prevState) => prevState.map(fileData => {
					return fileData.fileId !== fileId ? fileData : {
						...fileData,
						media,
						ready: true
					}
				}))
			})
			.catch((error) => {
				console.error(error)
				
				setFiles((prevState) => prevState.map(fileData => {
					return fileData.fileId !== fileId ? fileData : {
						...fileData,
						error: true
					}
				}))
			})
		
		setFiles((prevFiles) => {
			const fileData = {
				fileId,
				file,
				ready: false,
				request,
				abortController,
				progress: 0
			}
			const updatedFilesList = [...prevFiles, fileData]
			
			if (updatedFilesList.length === 0) {
				inputRef.current.value = ''
			}
			
			return updatedFilesList
		})
	}
	
	const handleFileChange = (newFiles) => {
		Array.from(newFiles).filter((file) => {
			const isUnderLimit = file.size / 1024 / 1024 <= MAX_FILE_SIZE_MB
			const isAllowedMime = acceptedTypes.includes(file.type)
			
			const isSelected = files.find(
				(selectedFile) => {
					return selectedFile.file.name === file.name
				}
			) !== undefined
			
			if (!isAllowedMime) {
				// TODO: Switch to a toast notification
				console.log(`File ${file.name} is not allowed`)
				return false
			}
			
			if (!isUnderLimit) {
				// TODO: Switch to a toast notification
				console.log(`File ${file.name} is too big. Max file size: ${MAX_FILE_SIZE_MB}mb`)
				return false
			}
			
			if (!isSelected) {
				useFileUpload(file)
			}
		})
	}
	return (
		<div className="media-upload file-uploader">
			<input
				ref={inputRef}
				type="file"
				accept={`${ALLOWED_IMAGE_TYPES},${ALLOWED_VIDEO_TYPES},${ALLOWED_AUDIO_TYPES}`}
				onChange={(event) => {
					handleFileChange(event.target.files)
				}}
				style={{
					width: 0,
					height: 0,
					margin: 0,
					border: 0,
					padding: 0,
					opacity: 0
				}}
				multiple
			/>
			<div
				className="ui-action file-input-trigger"
				onClick={() => {
					inputRef.current.click()
				}}
			>{children}</div>
			{showPreviews && <FilePreviewer
				files={files}
				handleRemove={handleRemove}
			/>}
		</div>
	)
})

FileUploader.defaultProps = {
	acceptedTypes: [
		...ALLOWED_IMAGE_TYPES,
		...ALLOWED_VIDEO_TYPES,
		...ALLOWED_AUDIO_TYPES,
	],
	showPreviews: true
}

FileUploader.propTypes = {
	handleChange: PropTypes.func.isRequired,
	handleReadyStateChange: PropTypes.func.isRequired,
	showPreviews: PropTypes.bool,
	acceptedTypes: PropTypes.array
}

export {
	FilePreview,
	FilePreviewer,
	formatFiles
}

export default FileUploader