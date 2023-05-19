import React from 'react'
import { Link } from 'react-router-dom'
import PropTypes from 'prop-types'

import { VerifiedBadge } from './VerifiedBadge.js'

const DisplayName = ({ profile, linked }) => (
	<span className="name align-center-wrap">
		{linked && <Link
			to={`/@${profile.username}`}
			className="unstyled-link"
		>
			{profile.name}
		</Link>}
		
		{!linked && <span>
			{profile.name}
		</span>}
		
		<VerifiedBadge verificationLevel={profile.verificationLevel} />
	</span>
)

DisplayName.defaultProps = {
	linked: false
}

DisplayName.propTypes = {
	linked: PropTypes.bool,
	profile: PropTypes.object.isRequired
}

export default DisplayName