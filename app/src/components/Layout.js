import React from 'react'
import classNames from 'classnames'
import { useSelector } from 'react-redux'

import { Navigation } from './Navigation.js'
import { useAuthenticated } from '../context/Auth.js'

const Layout = ({ children, page, disableNav, stickyNav }) => {
	const { loggedIn } = useAuthenticated()
	const appTheme = useSelector(state => state.user.settings.appTheme)
	
	return <main
		data-theme={appTheme}
		data-authenticated={loggedIn === true}
		page={page}
	>
		{!disableNav && <Navigation
			theme={appTheme}
			sticky={stickyNav}
			transparent={true}
			page={page}
		/>}
		<div className={classNames('content', page)}>
			{children}
		</div>
	</main>
}

export default Layout