import React from 'react'
import { Link } from 'react-router-dom'
import PropTypes from 'prop-types'

import { VerifiedBadge } from './VerifiedBadge.js'

const DisplayName = ({ profile, username, linked, wrap }) => {
	const WrapComponent = wrap ? 'div' : React.Fragment
	const TextComponent = wrap ? 'div' : 'span'
	
	return <WrapComponent className={wrap && 'display-name-wrap'}>
		<TextComponent className="display-name align-center-wrap">
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
		</TextComponent>
		{username && <TextComponent className="username">
			{linked && <Link
				to={`/@${profile.username}`}
				className="unstyled-link"
			>
				{`@${profile.username}`}
			</Link>}
			
			{!linked && <>{`@${profile.username}`}</>}
		</TextComponent>}
	</WrapComponent>
}

DisplayName.defaultProps = {
	username: false,
	linked: false,
	wrap: false
}

DisplayName.propTypes = {
	profile: PropTypes.object.isRequired,
	username: PropTypes.bool,
	linked: PropTypes.bool,
	wrap: PropTypes.bool
}

export default DisplayName