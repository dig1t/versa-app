/* eslint-disable no-undef */
import classNames from 'classnames'
import React, { useEffect, useRef, useState } from 'react'
import PropTypes from 'prop-types'

import api from '../../util/api.js'

const MAX_FILE_SIZE_MB = 20
const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
const ALLOWED_VIDEO_TYPES = ['video/mp4', 'video/quicktime']
const ALLOWED_AUDIO_TYPES = ['audio/mpeg', 'audio/wav']

const useFileUpload = (file) => {
	const [media, setMedia] = useState({})
	
	const data = new FormData()
	
	console.log('FILE UPLAOD CALLFILE UPLAOD CALLFILE UPLAOD CALL')
	data.append('file', file)
	
	// api.post('/v1/media/upload', data, {
	// 	headers: {
	// 		'Content-Type': `multipart/form-data; boundary=${data._boudary}`
	// 	}
	// })
	// 	.then((media) => {
	// 		console.log(media)
	// 	})
	// 	.catch((error) => {
	// 		console.error(error)
	// 	})
	
	return { media }
}

const PreviewImage = ({ file, onRemove }) => {
	const [rawImage, setRawImage] = useState(null)
	const [fileType, setFileType] = useState('unknown')
	
	useEffect(() => {
		console.log('upload file')
		
		const data = new FormData()
		
		console.log('FILE UPLAOD CALLFILE UPLAOD CALLFILE UPLAOD CALL')
		data.append('file', file)
		
		api.post('/v1/media/upload', data, {
			headers: {
				'Content-Type': `multipart/form-data; boundary=${data._boudary}`
			}
		})
			.then((media) => {
				console.log(media)
			})
			.catch((error) => {
				console.error(error)
			})
	}, [])
	
	const handleRemove = () => {
		onRemove(file)
	}
	
	const loadImagePreview = (file) => {
		const reader = new FileReader()
		
		reader.onload = (event) => {
			setRawImage(event.target.result)
		}
		
		reader.readAsDataURL(file)
	}
	
	const renderPreview = () => {
		if (ALLOWED_IMAGE_TYPES.includes(file.type)) {
			loadImagePreview(file)
			//setFileType('image')
			
			return <img src={rawImage} alt={file.name} onClick={handleRemove} />
		} else if (ALLOWED_VIDEO_TYPES.includes(file.type)) {
			//setFileType('video')
			
			return (
				<video controls>
					<source src={URL.createObjectURL(file)} type={file.type} />
					Your browser does not support the video tag.
				</video>
			)
		} else if (ALLOWED_AUDIO_TYPES.includes(file.type)) {
			//setFileType('audio')
			
			return <img src="/i/audio.png" alt={file.name} onClick={handleRemove} />
		} else {
			return null
		}
	}
	
	return (
		<div className={classNames(
			'upload-preview',
			`upload-type-${fileType}`
		)}>
			{renderPreview()}
			<button onClick={handleRemove}>Remove</button>
		</div>
	)
}

const FileUploader = ({ acceptedTypes, handleChange }) => {
	const [files, setFiles] = useState([])
	const inputRef = useRef(null)
	
	//useEffect(() => handleChange(files), [files])
	
	const handleFileChange = (newFiles) => {
		console.log(inputRef.current.value)
		
		const filteredFiles = Array.from(newFiles).filter(
			(file) => {
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
				
				return !isSelected
			}
		)
		
		setFiles((prevFiles) => {
			const updatedFilesList = [...prevFiles, ...filteredFiles]
			
			if (updatedFilesList.length === 0) {
				inputRef.current.value = ''
			}
			
			return updatedFilesList
		})
	}
	
	const handleRemove = (file) => {
		setFiles((prevFiles) => {
			const newFiles = prevFiles.filter((prevFile) => prevFile !== file)
			
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
				file={file}
				key={file.path}
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
			}}>Upload</button>
		</div>
	)
}