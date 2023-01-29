import React, { useCallback } from 'react'
import classNames from 'classnames'
import PropTypes from 'prop-types'

const iconAlias = {
	like: 'heart',
}

const Icon = props => {
	const { name, scale, hidden } = props
	const iconName = iconAlias[name] || name
	
	const renderIcon = useCallback(() => {
		const SVGImport = require(`../../../dist/public/assets/i/sprites/${name}.svg`).default
		
		return <i
			className={classNames(
				'icon',
				`icon-${iconName}`,
				scale && `icon-${scale}`
			)}
			aria-hidden="true"
		>
			<SVGImport />
		</i>
	}, [])
	
	return !hidden && renderIcon()
}

Icon.propTypes = {
	name: PropTypes.string.isRequired
}

Icon.defaultProps = {
	scale: '1x'
}

export default Icon