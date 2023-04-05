import React from 'react'
import { Icon, Tooltip } from '../components/UI/index.js'

export const VerifiedBadge = props => <Tooltip text="Verified Account">
	<Icon
		name="verified"
		hidden={!props.verificationLevel || props.verificationLevel === 0}
	/>
</Tooltip>