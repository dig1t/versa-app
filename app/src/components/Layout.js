import React from 'react'
import classNames from 'classnames'
import { useSelector } from 'react-redux'

import { Navigation } from './Navigation'
import Footer from './Footer'

const Layout = props => {
	const appTheme = useSelector(state => state.settings.appTheme)
	
	return <main data-theme={appTheme} page={props.page}>
		{!props.disableNav && <Navigation theme={appTheme} sticky={props.stickyNav} transparent={true} page={props.page} />}
		<div className={classNames('content', props.page)}>
			{props.children}
			{props.showFooter && <Footer />}
		</div>
	</main>
}

export default Layout