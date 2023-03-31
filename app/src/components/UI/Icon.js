import React, { useCallback, useMemo } from 'react'
import classNames from 'classnames'
import PropTypes from 'prop-types'

const iconAlias = {
	like: 'heart',
}

const Icon = props => {
	const { name, scale, hidden } = props
	const iconName = iconAlias[name] || name
	
	const SVGImport = React.memo(() => {
		const _svgImport = require(`../../../dist/public/assets/i/sprites/${name}.svg`).default
		
		return <_svgImport />
	})
	
	const _svgImport = require(`../../../dist/public/assets/i/sprites/${name}.svg`).default
	
	return !hidden && <i
		className={classNames(
			'icon',
			`icon-${iconName}`,
			scale && `icon-${scale}`
		)}
		aria-hidden="true"
	>
		<_svgImport
			style={{
				transform: typeof props.rot === 'number' && `rotate(${props.rot}deg)`
			}}
		/>
	</i>
}

Icon.propTypes = {
	name: PropTypes.string.isRequired
}

Icon.defaultProps = {
	scale: '1x'
}

export default Icon