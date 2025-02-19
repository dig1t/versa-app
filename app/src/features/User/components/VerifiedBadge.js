import React from 'react'
import { Icon, Tooltip } from '../../../components/UI.js'

export const VerifiedBadge = ({ verificationLevel }) => <Tooltip
	text="Verified Account"
>
	<Icon
		name="verified"
		hidden={!verificationLevel || verificationLevel === 0}
	/>
</Tooltip>
