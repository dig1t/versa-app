import React from 'react'
import classNames from 'classnames'
import { useSelector } from 'react-redux'

import { Navigation } from './Navigation.js'
import { useAuthenticated } from '../context/Auth.js'

const Layout = props => {
	const { loggedIn } = useAuthenticated()
	const appTheme = useSelector(state => state.user.settings.appTheme)
	
	return <main
		data-theme={appTheme}
		data-authenticated={loggedIn === true}
		page={props.page}
	>
		{!props.disableNav && <Navigation
			theme={appTheme}
			sticky={props.stickyNav}
			transparent={true}
			page={props.page}
		/>}
		<div className={classNames('content', props.page)}>
			{props.children}
		</div>
	</main>
}

export default Layout