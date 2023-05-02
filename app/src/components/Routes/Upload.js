/* eslint-disable no-undef */
import classNames from 'classnames'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import PropTypes from 'prop-types'
import { v4 as uuidv4 } from 'uuid'

import api from '../../util/api.js'

const MAX_FILE_SIZE_MB = 20
const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
const ALLOWED_VIDEO_TYPES = ['video/mp4', 'video/quicktime']
const ALLOWED_AUDIO_TYPES = ['audio/mpeg', 'audio/wav']

const PreviewImage = ({ fileData, onRemove }) => {
	const [rawImage, setRawImage] = useState(null)
	const [fileType, setFileType] = useState('unknown')
	
	const handleRemove = () => {
		onRemove(fileData)
	}
	
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
		console.log(fileData)
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
				return <img src="/i/audio.png" alt={fileData.file.name} onClick={handleRemove} />
			}
		}
	}, [fileData, fileType, handleRemove, rawImage])
	
	return (
		<div className={classNames(
			'upload-preview',
			`upload-type-${fileType}`
		)}>
			<div>is ready? {fileData.ready ? 'yes' : 'no'}</div>
			<div>progress {fileData.progress}</div>
			{renderPreview()}
			<button onClick={handleRemove}>Remove</button>
		</div>
	)
}

const FileUploader = ({ acceptedTypes, handleChange }) => {
	const [files, setFiles] = useState([])
	const inputRef = useRef(null)
	const abortController = new AbortController()
	
	//useEffect(() => handleChange(files), [files])
	
	useEffect(() => {
		// Abort if there is an upload in progress
		return () => abortController.abort()
	}, [])
	
	useEffect(() => {
		console.log('files list changes', files)
	}, [files])
	
	const useFileUpload = (file) => {
		console.log('UPLOADING FILE, data:', file)
		
		const fileId = uuidv4()
		const data = new FormData()
		
		data.append('file', file)
		
		const request = api.post('/v1/media/upload', data, {
			signal: abortController.signal,
			headers: {
				'Content-Type': `multipart/form-data; boundary=${data._boudary}`
			},
			onUploadProgress: (progressEvent) => {
				console.log('UPLOAD PROGRESS', progressEvent)
				const progress = Math.round(
					(progressEvent.loaded / progressEvent.total) * 100
				)
				console.log('progress',progress)
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
				console.log(media)
				
				setFiles((prevState) => prevState.map(file => {
					if (file.fileId === fileId) {
						return {
							...file,
							media,
							ready: true
						}
					}
					
					return file
				}))
			})
			.catch((error) => {
				console.error(error)
				
				setFiles((prevState) => prevState.map(file => {
					if (file.fileId === fileId) {
						return {
							...file,
							error: true
						}
					}
					
					return file
				}))
			})
		
		setFiles((prevFiles) => {
			const fileData = {
				fileId,
				file,
				ready: false,
				request,
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
				(selectedFile) => file.name === selectedFile.name
			)
			
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
			
			console.log(isSelected)
			if (!isSelected) {
				useFileUpload(file)
			}
		})
	}
	
	const handleRemove = (fileData) => {
		// Abort any ongoing requests for removed files
		const ongoingRequest = files.find(file => file.fileId === fileData.fildId)?.request
		ongoingRequest?.abort()
		
		setFiles((prevFiles) => {
			const newFiles = prevFiles.filter((prevFile) => prevFile.file !== fileData.file)
			
			if (newFiles.length === 0) {
				inputRef.current.value = ''
			}
			
			return newFiles
		})
	}
	
	return (
		<div className="file-uploader">
			<input
				ref={inputRef}
				type="file"
				accept={`${ALLOWED_IMAGE_TYPES},${ALLOWED_VIDEO_TYPES},${ALLOWED_AUDIO_TYPES}`}
				onChange={(event) => {
					handleFileChange(event.target.files)
				}}
				style={{
					opacity: 0,
					width: 0,
					height: 0
				}}
				multiple
			/>
			<button
				className="file-input-trigger"
				onClick={() => {
					inputRef.current.click()
				}}
			>select file(s)</button>
			{files.map((file, index) => <PreviewImage
				fileData={file}
				key={file.name + index}
				onRemove={handleRemove}
			/>)}
		</div>
	)
}

FileUploader.defaultProps = {
	acceptedTypes: [
		...ALLOWED_IMAGE_TYPES,
		...ALLOWED_VIDEO_TYPES,
		...ALLOWED_AUDIO_TYPES,
	]
}

FileUploader.propTypes = {
	handleChange: PropTypes.func.isRequired
}

const handleUpload = (files) => {
	console.log('finally, upload this:', files)
}

export default function App() {
	const [files, setFiles] = useState([])
	
	return (
		<div className="app">
			<FileUploader
				handleChange={(newFiles) => setFiles(newFiles)}
			/>
			
			<button onClick={() => {
				console.log('clicked Upload')
				handleUpload(files)
			}}>Upload</button>
		</div>
	)
}