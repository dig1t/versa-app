import React, { useEffect, useState } from 'react'
import classNames from 'classnames'
import PropTypes from 'prop-types'

const iconAlias = {
	like: 'heart'
}

const IconWrap = ({ children }) => <div className="icon-wrap">
	{children}
</div>

const Icon = ({
	name,
	scale,
	hidden,
	rot,
	wrap,
	...props
}) => {
	const [SvgModule, setSvgModule] = useState({})
	
	const iconName = iconAlias[name] || name
	
	useEffect(() => {
		async function loadSvg() {
			const _svgImport = await new Promise((resolve, reject) => {
				import(`../../../public/assets/i/sprites/${name}.svg`)
					.then((result) => resolve(result.default))
					.catch((error) => {
						console.warn(`Could not import SVG for ${name}`)
						reject(error)
					})
			})
			setSvgModule({
				Element: _svgImport
			})
		}
		
		loadSvg()
	}, [name])
	
	const Wrap = wrap === true ? IconWrap : React.Fragment
	
	return !hidden && SvgModule.Element && <i
		className={classNames(
			'icon',
			`icon-${iconName}`,
			scale && `icon-${scale}`
		)}
		aria-hidden="true"
		{ ...props }
	>
		<Wrap>
			<SvgModule.Element style={{
				transform: typeof rot === 'number' && `rotate(${rot}deg)`
			}} />
		</Wrap>
	</i>
}

Icon.propTypes = {
	name: PropTypes.string.isRequired
}

Icon.defaultProps = {
	scale: '1x'
}

export { IconWrap }

export default Icon