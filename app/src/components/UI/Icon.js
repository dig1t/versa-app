import React, { useCallback, useEffect, useState } from 'react'
import classNames from 'classnames'
import PropTypes from 'prop-types'

const iconAlias = {
	verified: 'check-circle',
	like: 'heart',
	repost: 'retweet'
}

const Icon = props => {
	const { name, scale, hidden, svg } = props
	const iconName = iconAlias[name] || name
	const [res, setRes] = useState(null)
	
	const renderIcon = useCallback(() => {
		switch(svg) {
			case true:
					const SVGImport = require(`../../../dist/public/assets/i/sprites/${name}.svg`).default
					
					return <i
						className={classNames(
							'icon', `icon-${name}`,
						)}
						aria-hidden="true"
					>
						<SVGImport />
					</i>
			default:
				return <i
					className={classNames(
						'icon',
						'fa',
						`fa-${scale}`,
						`fa-${iconName}`,
						`icon-${name}`,
					)}
					aria-hidden="true"
				/>
		}
	}, [svg])
	
	return !hidden && renderIcon()
}

Icon.propTypes = {
	name: PropTypes.string.isRequired
}

Icon.defaultProps = {
	scale: '1x'
}

export default Icon