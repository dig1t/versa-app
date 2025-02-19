/* eslint-disable no-undef */
import React, { useEffect, useRef, useState } from 'react'
import ReactDOM from 'react-dom'
import { useSelector } from 'react-redux'
import PropTypes from 'prop-types'

const getDOMRoot = () => {
	const res = document.getElementById('ui-root')

	if (res) return res

	const root = document.createElement('div')
	root.setAttribute('id', 'ui-root')
	document.body.appendChild(root)

	return root
}

const Portal = ({ active, children }) => {
	const root = useRef()
	const [mounted, setMounted] = useState(false)
	const appTheme = useSelector((state) => state.user.settings.appTheme)

	useEffect(() => {
		// Mounted
		root.current = getDOMRoot()
		setMounted(true)
	}, [])

	return mounted ? ReactDOM.createPortal(
		<>
			{active && <main className="portal" data-theme={appTheme}>
				{children}
			</main>}
		</>,
		root.current
	) : <></>
}

Portal.defaultProps = {
	active: false
}

Portal.propTypes = {
	active: PropTypes.bool
}

export default Portal
