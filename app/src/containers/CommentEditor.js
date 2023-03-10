import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'

import { Input, Icon } from '../components/UI/index.js'
import api from '../util/api.js'

const CommentEditor = props => {
	const [data, setData] = useState({
		text: ''
	})
	
	const handleSubmit = event => {
		const body = data.text
		
		setData({ text: '' })
		
		api.post(`/v1/content/${props.contentId}/comment`, { body })
			.then(data => {
				if (!props.handleSuccess) return
				
				props.handleSuccess(data)
			})
	}
	
	return <div className="post-editor">
		<label className="box">
			<Input
				handleValueChange={value => setData({ text: value })}
				value={data.text}
				type="textarea"
				placeholder="Write a status..."
				displayError={false}
			/>
			<div className="editor-controls">
				<div className="attachments center-wrap">
					<div className="photo">
						<Icon name="photo" />
					</div>
				</div>
				<button
					className="btn btn-round btn-primary post"
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