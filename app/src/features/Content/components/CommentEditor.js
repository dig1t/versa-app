import React, { useRef, useState } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'

import { Input } from '../../../components/UI.js'
import api from '../../../util/api.js'

const CommentEditor = ({ contentId, handleSuccess }) => {
	const inputRef = useRef(null)
	const [valid, setValid] = useState(false)
	
	const handleSubmit = () => {
		const body = inputRef.current.getValue()
		
		inputRef.current.setValue('')
		
		api.post(`/v1/content/${contentId}/comment`, { body })
			.then((response) => {
				if (!handleSuccess) return
				
				handleSuccess(response)
			})
			.catch((error) => {
				// TODO: add toast notification
				console.warn('Error posting comment')
				console.log(error)
			})
	}
	
	return <div className="post-editor simple">
		<label className="box">
			<Input
				ref={inputRef}
				handleValidity={setValid}
				type="textarea"
				placeholder="Write a comment..."
				displayError={false}
				minLength={1}
				maxLength={512}
			/>
			<div className="editor-controls float-r">
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

CommentEditor.propTypes = {
	contentId: PropTypes.string.isRequired,
	handleSuccess: PropTypes.func
}

export default CommentEditor