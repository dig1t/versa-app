/* eslint-disable no-undef */
import classNames from 'classnames'
import React, { useEffect, useRef, useState } from 'react'
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
	
	const renderPreview = () => {
		console.log(fileData)
		if (ALLOWED_IMAGE_TYPES.includes(fileData.file.type)) {
			loadImagePreview(fileData.file)
			//setFileType('image')
			
			return <img src={rawImage} alt={fileData.file.name} onClick={handleRemove} />
		} else if (ALLOWED_VIDEO_TYPES.includes(fileData.file.type)) {
			//setFileType('video')
			
			return (
				<video onClick={handleRemove}>
					<source src={URL.createObjectURL(fileData.file)} type={fileData.file.type} />
					Your browser does not support the video tag.
				</video>
			)
		} else if (ALLOWED_AUDIO_TYPES.includes(fileData.file.type)) {
			//setFileType('audio')
			
			return <img src="/i/audio.png" alt={fileData.file.name} onClick={handleRemove} />
		} else {
			return null
		}
	}
	
	return (
		<div className={classNames(
			'upload-preview',
			`upload-type-${fileType}`
		)}>
			<div>is ready? {fileData.ready ? 'yes' : 'no'}</div>
			{renderPreview()}
			<button onClick={handleRemove}>Remove</button>
		</div>
	)
}

const FileUploader = ({ acceptedTypes, handleChange }) => {
	const [files, setFiles] = useState([])
	const inputRef = useRef(null)
	
	//useEffect(() => handleChange(files), [files])
	
	useEffect(() => {
		console.log('files list changes', files)
	}, [files])
	
	const useFileUpload = (fileData) => {
		console.log('UPLOADING FILE, data:', fileData)
		
		const data = new FormData()
		
		data.append('file', fileData.file)
		
		api.post('/v1/media/upload', data, {
			headers: {
				'Content-Type': `multipart/form-data; boundary=${data._boudary}`
			}
		})
			.then((media) => {
				console.log(media)
				
				setFiles((prevState) => prevState.map(file => {
					if (file.fileId === fileData.fileId) {
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
			})
	}
	
	const handleFileChange = (newFiles) => {
		console.log(newFiles)
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
				
				if (!isSelected) {
					setFiles((prevFiles) => {
						const fileId = uuidv4()
						const fileData = {
							fileId,
							file,
							ready: false
						}
						const updatedFilesList = [...prevFiles, fileData]
						
						useFileUpload(fileData)
						
						if (updatedFilesList.length === 0) {
							inputRef.current.value = ''
						}
						
						return updatedFilesList
					})
				}
				
				return !isSelected
			}
		)
		
		console.log('setFiles 0')
		// setFiles((prevFiles) => {
		// 	const updatedFilesList = [...prevFiles, ...filteredFiles]
			
		// 	if (updatedFilesList.length === 0) {
		// 		inputRef.current.value = ''
		// 	}
			
		// 	return updatedFilesList
		// })
	}
	
	const handleRemove = (fileData) => {
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