import React from 'react'
import { Icon } from '../components/UI/index.js'

export const VerifiedBadge = props => <Icon
	name="verified"
	hidden={!props.verificationLevel || props.verificationLevel === 0}
/>