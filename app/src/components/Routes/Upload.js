/* eslint-disable no-undef */
import React, { useRef, useState } from 'react'

import FileUploader, { FilePreviewer, formatFiles } from '../../containers/FileUploader.js'

const handleUpload = (files) => {
	console.log('finally, upload this:', files)
}

export default function App() {
	const [files, setFiles] = useState([])
	const [filesReady, setFilesReady] = useState()
	const uploaderRef = useRef(null)
	
	useRef(() => console.log(files), [files])
	
	return (
		<div className="app">
			<FileUploader
				ref={uploaderRef}
				handleChange={(newFiles) => setFiles(newFiles)}
				handleReadyStateChange={(ready) => {
					console.log(ready)
					setFilesReady(ready)
				}}
				showPreviews={false}
			>
				<button
					className="media-upload-trigger"
				>select file(s)</button>
			</FileUploader>
			
			{uploaderRef && <FilePreviewer
				files={files}
				handleRemove={(fileId) => {
					console.log('remove fileid', fileId)
					uploaderRef.current.removeFile(fileId)
				}}
			/>}
			
			<button onClick={() => {
				if (filesReady !== true) return
				
				handleUpload(formatFiles(files))
			}}>Upload</button>
		</div>
	)
}