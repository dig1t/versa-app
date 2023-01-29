import React from 'react'
import { Link } from 'react-router-dom'
import classNames from 'classnames'
import { useSelector } from 'react-redux'

import { isAuthenticated } from '../context/Auth'
import { isHydrated } from '../context/Hydration'
import { defaultAssets } from '../constants/assets'
import Avatar from '../containers/Avatar'
import { Icon } from './UI'
// import Logout from '../../containers/Logout'

//import { BurgerMenu } from './UI'

const appLinks = [
	['/', 'Home', 'home'],
	['/play', 'Play', 'turntable'],
	['/chat', 'Chat', 'users']
]

const NavButton = ({ type, children }) => <li className={classNames(
		'btn', type
	)}>
	<div className="btn-wrap">
		<div className="push" />
		<div className="wrap">
			<div className="center-wrap">{ children }</div>
		</div>
	</div>
</li>

const AppLink = props => <li className="app-link center-wrap">
	<Link to={props.redirect}>
		{props.icon && <Icon name={props.icon} scale="lg" />}
	</Link>
</li>

const Shortcut = props => <NavButton type="shortcut">
	<div className="shortcut-btn">
		<div className="center-wrap">
			<Link to={props.redirect}>
				<div className="img" style={{
					backgroundImage: `url("${defaultAssets.avatar}")`
				}} />
			</Link>
		</div>
	</div>
</NavButton>

export const Navigation = () => {
	const hydrated = isHydrated()
	const { loggedIn } = isAuthenticated()
	
	const profile = useSelector(state => state.user.profile)
	
	return (loggedIn && hydrated) ? <nav>
		<div className="placeholder" />
		<div className="container">
			<ul>
				<li className="app-link center-wrap">
					<Link to="/" className={classNames(
						'icon',
						'icon-full-height',
					)}>
						<Icon name="logo-letter" />
					</Link>
				</li>
				
				<li className="divider" />
				
				{appLinks.map(link => <AppLink
					icon={link[2]}
					redirect={link[0]}
					key={`nav-app-link-${link[1]}`}
				/>)}
				
				<li className="divider" />
				
				<Shortcut icon="home" redirect="/home" />
				<Shortcut icon="message" redirect="/chat" />
				
				<NavButton type="action">
					<Icon name="new-post" />
				</NavButton>
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
	</nav> : <></>
}