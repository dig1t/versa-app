import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'

const CatPills = ({ pills, handleSelection, defaultCategory, value, squared, autoSelect }) => {
	const [activeCategory, setActiveCategory] = useState(null)
	const [isMounted, setIsMounted] = useState(false)

	useEffect(() => {
		if (pills.find((category) => category.name === defaultCategory)) {
			setActiveCategory(defaultCategory)
		}
	}, [defaultCategory])

	useEffect(() => {
		const categorySearch = pills.find((category) => category.name === activeCategory)

		if (categorySearch && (autoSelect || isMounted)) {
			handleSelection(categorySearch)
		}
	}, [activeCategory, autoSelect, isMounted])

	useEffect(() => {
		if (!isMounted) {
			setIsMounted(true)
		} else {
			setActiveCategory(value)
		}
	}, [value])

	return <div className={classNames(
		'cat-pills'
	)}>
		{pills.map((data) => <button
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

CatPills.defaultProps = {
	autoSelect: true
}

CatPills.propTypes = {
	pills: PropTypes.array.isRequired,
	handleSelection: PropTypes.func.isRequired,
	defaultCategory: PropTypes.string,
	value: PropTypes.string,
	squared: PropTypes.bool,
	autoSelect: PropTypes.bool
}

export default CatPills
