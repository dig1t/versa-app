import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'

const CatPills = ({ pills, handleSelection, defaultCategory, value, squared }) => {
	const [activeCategory, setActiveCategory] = useState(defaultCategory || null)
	const [mounted, setMounted] = useState(false)
	
	useEffect(() => handleSelection(
		pills.find(category => category.name === activeCategory)
	), [activeCategory])
	
	useEffect(() => {
		if (mounted === false) return setMounted(true)
		
		setActiveCategory(value)
	}, [value])
	
	return <div className={classNames(
		'cat-pills'
	)}>
		{pills.map(data => <button
			className={classNames(
				'pill',
				activeCategory === data.name && 'active',
				'btn',
				!squared && 'btn-round'
			)}
			key={`catpill-${data.name}`}
			onClick={() => setActiveCategory(data.name)}
		>{data.label}</button>)}
	</div>
}

CatPills.propTypes = {
	pills: PropTypes.array.isRequired,
	handleSelection: PropTypes.func.isRequired,
	defaultCategory: PropTypes.string,
	value: PropTypes.string,
	squared: PropTypes.bool
}

export default CatPills