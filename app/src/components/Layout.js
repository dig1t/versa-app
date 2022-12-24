import React, { useEffect, useState } from 'react'
import classNames from 'classnames'

import Navigation from './Navigation'
import Footer from './Footer'

const Layout = props => {
	const [theme, setTheme] = useState('light')
	
	useEffect(() => {
		setTheme(props.theme)
	}, [props.theme])
	
	return <main className={classNames(theme)} page={props.page}>
		{!props.disableNav && <Navigation theme={theme} sticky={props.stickyNav} transparent={true} page={props.page} />}
		<div className={classNames('content', props.page)}>{props.children}</div>
		{!props.disableFooter && <Footer />}
	</main>
}

export default Layout