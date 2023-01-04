import React from 'react'
import { Link } from 'react-router-dom'
import classNames from 'classnames'
import PropTypes from 'prop-types'
import { useSelector } from 'react-redux'

import { isAuthenticated } from '../context/Auth'
import { isHydrated } from '../context/Hydration'

//import { BurgerMenu } from './UI'

const links = [
	//['/', 'Home']
]

const NavWrap = props => <nav
	className={classNames(props.classNames, !props.loggedIn && 'no-auth')}
	role="navigation"
>
	<div className="placeholder"></div>
	<div className="box p-x-3">
		{ props.children }
	</div>
</nav>

const UserNav = props => {
	const profile = useSelector(state => state.user.profile)
	
	return <NavWrap loggedIn { ...props }>
		<ul className="center-x-wrap">
			<li className="logo">
				<Link className={classNames(
					'icon',
					'icon-full-height',
					'icon-logo' + (props.theme === 'dark' ? '--white' : '')
				)} to="/" />
			</li>
			<li>
				{profile.username && <Link to={'/@' + profile.username}>profile</Link>}
			</li>
		</ul>
	</NavWrap>
}

const GuestNav = props => <NavWrap { ...props }>
	<ul className="center-x-wrap">
		<li className="logo">
			<Link className={classNames(
				'icon',
				'icon-full-height',
				'icon-logo' + (props.theme === 'dark' ? '--white' : '')
			)} to="/" />
		</li>
		{links.map(link => {
			const className = classNames('nav-btn', {
				active: props.page === link[0]
			})
			
			return <li key={link[0]} className={className}>
				<Link to={link[0]}>{link[1]}</Link>
			</li>
		})}
	</ul>
	<ul className="align-center-wrap">
		<li>
			<Link to="/login" className="btn btn-secondary">LOGIN</Link>
		</li>
		<li>
			<Link to="/signup" className="btn btn-roundbtn-primary">SIGN UP</Link>
		</li>
	</ul>
</NavWrap>

const Navigation = props => {
	const hydrated = isHydrated()
	const { loggedIn } = isAuthenticated()
	
	return (loggedIn && hydrated) ? <UserNav { ...props } /> : <GuestNav { ...props } />
}

Navigation.propTypes = {
	theme: PropTypes.string.isRequired
}

Navigation.defaultProps = {
	theme: 'light'
}

export default Navigation