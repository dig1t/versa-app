import React from 'react'
import { Link } from 'react-router-dom'
import classNames from 'classnames'
import PropTypes from 'prop-types'
import { useSelector } from 'react-redux'

import { isAuthenticated } from '../context/Auth'
import { isHydrated } from '../context/Hydration'
import { defaultAssets } from '../constants/assets'
import Avatar from '../containers/Avatar'
import Icon from './UI/Icon'

//import { BurgerMenu } from './UI'

const links = [
	//['/', 'Home']
]

const Shortcut = props => <li className="shortcut">
	<Link to={props.redirect}>
		<div className="nav-button">
			<div className="push" />
			<div className="wrap">
				<div className="center-wrap">
						{props.icon && <Icon name={props.icon} scale="lg" />}
						{!props.icon && <div className="img" style={{
							backgroundImage: 'url("/assets/i/sprites/avatar.svg?url")'
						}} />}
				</div>
			</div>
		</div>
	</Link>
</li>

export const Navigation = props => {
	const profile = useSelector(state => state.user.profile)
	
	return <nav>
		<div className="placeholder" />
		<div className="container">
			<ul className="shortcuts">
				<li className="logo">
					<Link className={classNames(
						'icon',
						'icon-full-height',
					)} to="/">
						<Icon svg name="logo" />
					</Link>
				</li>
				<Shortcut icon="home" redirect="/home" />
				<Shortcut icon="inbox" redirect="/chat" />
				<Shortcut />
			</ul>
			
			<ul className="shortcuts user-shortcuts">
				<li className="shortcut avatar">
					{profile.username && <Avatar
						status="online"
						username={profile.username}
						clickRedirect
					/>}
				</li>
			</ul>
		</div>
	</nav>
}

const UserNav = props => {
	const profile = useSelector(state => state.user.profile)
	
	return <HeaderWrap loggedIn { ...props }>
		<ul className="center-x-wrap">
			<li className="logo">
				<Link className={classNames(
					'icon',
					'icon-full-height',
				)} to="/">
					<Icon svg name="logo" />
				</Link>
			</li>
		</ul>
		<ul className="align-center-wrap">
			<li>{profile.username && <Avatar
				status="online"
				username={profile.username}
				clickRedirect
			/>}</li>
		</ul>
	</HeaderWrap>
}

const GuestNav = props => <HeaderWrap { ...props }>
	<ul className="center-x-wrap">
		<li className="logo">
			<Link className={classNames(
				'icon',
				'icon-full-height',
			)} to="/">
				<Icon svg name="logo" />
			</Link>
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
</HeaderWrap>

export const Header = props => {
	const hydrated = isHydrated()
	const { loggedIn } = isAuthenticated()
	
	return (loggedIn && hydrated) ? <UserNav { ...props } /> : <GuestNav { ...props } />
}

Header.propTypes = {
	theme: PropTypes.string.isRequired
}

Header.defaultProps = {
	theme: 'light'
}