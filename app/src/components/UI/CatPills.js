import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'

const CatPills = props => {
	const [activeCategory, setActiveCategory] = useState(props.default || null)
	const [mounted, setMounted] = useState(false)
	
	useEffect(() => props.handleSelection(
		props.pills.find(category => category.name === activeCategory)
	), [activeCategory])
	
	useEffect(() => {
		if (mounted === false) return setMounted(true)
		
		setActiveCategory(props.value)
	}, [props.value])
	
	return <div className={classNames(
		'cat-pills'
	)}>
		{props.pills.map(data => <button
			className={classNames(
				'pill',
				activeCategory === data.name && 'active',
				'btn',
				!props.squared && 'btn-round'
			)}
			key={`catpill-${data.name}`}
			onClick={() => setActiveCategory(data.name)}
		>{data.label}</button>)}
	</div>
}

CatPills.propTypes = {
	pills: PropTypes.array.isRequired,
	handleSelection: PropTypes.func.isRequired,
	default: PropTypes.string,
	value: PropTypes.string,
	squared: PropTypes.bool
}

export default CatPills