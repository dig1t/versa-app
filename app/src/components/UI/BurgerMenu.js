import React, { useState } from 'react'
import PropTypes from 'prop-types'

const BurgerMenu = props => {
	const [menuOpen, setMenuOpen] = useState(props.open || false)
	
	return <div
		className={[
			'nav-toggle',
			'hamburger',
			menuOpen && 'active'
		]}
		onClick={() => setMenuOpen({open: !menuOpen})}
	><i /></div>
}

BurgerMenu.propTypes = {
	open: PropTypes.element.bool
}

export default BurgerMenu