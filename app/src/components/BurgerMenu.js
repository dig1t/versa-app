import React, { useState } from 'react'
import PropTypes from 'prop-types'

const BurgerMenu = ({ open }) => {
	const [menuOpen, setMenuOpen] = useState(open || false)
	
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