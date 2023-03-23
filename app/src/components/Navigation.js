import React, { useEffect } from 'react'
import { Link } from 'react-router-dom'
import classNames from 'classnames'
import { useSelector } from 'react-redux'

import { isAuthenticated } from '../context/Auth.js'
import { isHydrated } from '../context/Hydration.js'
import { defaultAssets } from '../constants/assets.js'
import Avatar from '../containers/Avatar.js'
import { Icon } from './UI/index.js'
import DropMenu from './UI/DropMenu.js'
// import Logout from '../../containers/Logout.js'

//import { BurgerMenu } from './UI/index.js'

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
	useEffect(() => console.log(profile),
	[profile])
	
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
					{profile && <Avatar
						status="online"
						userId={profile.userId}
						clickRedirect={true}
					/>}
				</li>
			</ul>
		</div>
	</nav> : <></>
}