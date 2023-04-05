import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'

import { Input, Icon } from '../components/UI/index.js'
import api from '../util/api.js'

const CommentEditor = props => {
	const [data, setData] = useState({
		text: ''
	})
	const [saveReady, setSaveReady] = useState(false)
	
	useEffect(() => setSaveReady(data.text.length > 0), [data])
	
	const handleSubmit = event => {
		if (!saveReady) return
		
		const body = data.text
		
		setData({ text: '' })
		
		api.post(`/v1/content/${props.contentId}/comment`, { body })
			.then(response => {
				if (!props.handleSuccess) return
				
				props.handleSuccess(response)
			})
	}
	
	return <div className="post-editor simple">
		<label className="box">
			<Input
				handleValueChange={value => setData({ text: value })}
				value={data.text}
				type="textarea"
				placeholder="Write a comment..."
				displayError={false}
			/>
			<div className="editor-controls float-r">
				<button
					className={classNames(
						'btn btn-round btn-primary post',
						!saveReady && 'btn-disabled'
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