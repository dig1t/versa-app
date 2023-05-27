import React, { useMemo } from 'react'
import PropTypes from 'prop-types'

import Video from './Video.js'
import Modal from '../../../components/Modal.js'

const ContentMedia = ({ source, type }) => {
	const contentMedia = useMemo(() => {
		switch(type) {
			case 'album':
				return <div className="album-wrap">
					<div className="img img-fill" style={{
						backgroundImage: `url(${source})`
					}} />
				</div>
			case 'image':
				return <Modal type="image" image={source}>
					<img src={source} />
				</Modal>
			case 'video':
				return <Video
					rawSource={source}
				/>
		}
	}, [source, type])
	
	return <div className="content-media post-container">
		<div className={type}>
			{contentMedia}
		</div>
	</div>
}

ContentMedia.propTypes = {
	type: PropTypes.string.isRequired,
	source: PropTypes.string.isRequired
}

export default ContentMedia