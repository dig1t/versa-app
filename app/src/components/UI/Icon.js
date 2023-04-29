import React, { useEffect, useState } from 'react'
import classNames from 'classnames'
import PropTypes from 'prop-types'

const iconAlias = {
	like: 'heart'
}

const Icon = ({ name, scale, hidden, rot }) => {
	const [SvgModule, setSvgModule] = useState({})
	
	const iconName = iconAlias[name] || name
	
	useEffect(() => {
		async function loadSvg() {
			const _svgImport = await new Promise((resolve, reject) => {
				import(`../../../public/assets/i/sprites/${name}.svg`)
					.then((result) => resolve(result.default))
					.catch((error) => reject(error))
			})
			setSvgModule({
				Element: _svgImport
			})
		}
		
		loadSvg()
	}, [name])
	
	return !hidden && <i
		className={classNames(
			'icon',
			`icon-${iconName}`,
			scale && `icon-${scale}`
		)}
		aria-hidden="true"
	>
		{ SvgModule.Element && <SvgModule.Element
			style={{
				transform: typeof rot === 'number' && `rotate(${rot}deg)`
			}}
		/>}
	</i>
}

Icon.propTypes = {
	name: PropTypes.string.isRequired
}

Icon.defaultProps = {
	scale: '1x'
}

export default Icon