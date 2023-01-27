import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'

const CatPills = props => {
	const [activeCategory, setActiveCategory] = useState(props.default || null)
	
	useEffect(() => props.handleSelection(activeCategory), [activeCategory])
	
	return <div className={classNames(
		'cat-pills'
	)}>
		{props.pills.map(pill => <button
			className={classNames(
				'pill',
				activeCategory === pill.category && 'active',
				'btn',
				!props.squared && 'btn-round'
			)}
			key={`catpill-${pill.category}`}
			onClick={() => setActiveCategory(pill.category)}
		>{pill.label}</button>)}
	</div>
}

CatPills.propTypes = {
	pills: PropTypes.array.isRequired,
	handleSelection: PropTypes.func.isRequired,
	default: PropTypes.string,
	squared: PropTypes.bool
}

export default CatPills