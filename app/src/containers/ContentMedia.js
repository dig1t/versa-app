import React, { useCallback } from 'react'
import PropTypes from 'prop-types'

const ContentMedia = ({ type, source }) => {
	// media: {
	// 	type: 'image',
	// 	source: 'https://via.placeholder.com/1500'
	// }
	
	const renderMedia = useCallback(() => {
		switch(type) {
			case 'album':
				return <div className="album-wrap">
					<div className="img img-fill" style={{
						backgroundImage: `url(${source})`
					}} />
				</div>
			case 'image':
				return <img src={source} />
		}
	}, [type])
	
	return <div className="media">
		{renderMedia()}
	</div>
}

ContentMedia.propTypes = {
	type: PropTypes.string.isRequired,
	source: PropTypes.string.isRequired
}

export default ContentMedia