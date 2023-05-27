import React from 'react'

const Video = ({ rawSource }) => {
	return <div className="media-video">
		<video
			src={rawSource}
			controls
		/>
	</div>
}

export default Video