import React from 'react'
import { Link } from 'react-router-dom'
import classNames from 'classnames'

import { useAuthenticated } from '../../Auth/context/Auth.js'
import { isHydrated } from '../context/Hydration.js'
import { defaultAssets } from '../../../constants/assets.js'
import Avatar from '../../User/components/Avatar.js'
import { Icon } from '../../../components/UI.js'
import DropMenu from '../../../components/DropMenu.js'
import Modal from '../../../components/Modal.js'
import PostEditor from '../../Content/components/PostEditor.js'
import Logout from '../../Auth/components/Logout.js'
import useProfile from '../../User/hooks/useProfile.js'

//import { BurgerMenu } from './UI.js'

const NewPostBorder = () => (<div className="new-post-border">
	<svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
		<rect
			width="100%"
			height="100%"
			fill="none"
			rx="94"
			ry="94"
			stroke="currentColor"
			stroke-width="3"
			stroke-dasharray="18 8"
			stroke-dashoffset="0"
			stroke-linecap="butt"
		/>
	</svg>
</div>)

const appLinks = [
	['/', 'Home', 'home'],
	//['/play', 'Play', 'turntable'],
	['/chat', 'Chat', 'comment'] // TODO: add chat icon
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

const AppLink = ({ icon, redirect }) => <li className="app-link center-wrap">
	<Link to={redirect}>
		{icon && <Icon name={icon} scale="lg" />}
	</Link>
</li>

const Shortcut = ({ redirect }) => <NavButton type="shortcut">
	<div className="shortcut-btn">
		<div className="center-wrap">
			<Link to={redirect}>
				<div className="img" style={{
					backgroundImage: `url("${defaultAssets.avatar}")`
				}} />
			</Link>
		</div>
	</div>
</NavButton>

export const Navigation = () => {
	const hydrated = isHydrated()
	const { loggedIn } = useAuthenticated()
	const profile = useProfile(true)
	
	const Menu = <DropMenu.ItemMenu>
		{profile && <DropMenu.Link link={`/@${profile.username}`}>My Profile</DropMenu.Link>}
		<DropMenu.Divider />
		<DropMenu.Link link="/settings">Settings</DropMenu.Link>
		
		<li>
			<Logout />
		</li>
	</DropMenu.ItemMenu>
	
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
				
				{appLinks.map((link) => <AppLink
					icon={link[2]}
					redirect={link[0]}
					key={`nav-app-link-${link[1]}`}
				/>)}
				
				<li className="divider" />
				
				<Shortcut icon="home" redirect="/home" />
				<Shortcut icon="message" redirect="/chat" />
				
				<li className="btn new-post">
					<Modal
						component={<PostEditor />}
					>
						<div className="btn-wrap">
							<div className="push" />
							<div className="wrap">
								<div className="center-wrap">
									<Icon name="plus" />
									<NewPostBorder />
								</div>
							</div>
						</div>
					</Modal>
				</li>
			</ul>
			
			<ul className="shortcuts user-shortcuts">
				<li className="shortcut avatar">
					<DropMenu.Menu
						menu={Menu}
						sideOffset={-20}
						position='right'
					>
						{profile && <Avatar
							status="online"
							userId={profile.userId}
						/>}
					</DropMenu.Menu>
				</li>
			</ul>
		</div>
	</nav> : <nav className="nav-logged-out">
		<div>
			<Link to='/login'>
				Sign In
			</Link>
			<Link to='/signup'>
				Sign Up
			</Link>
		</div>
	</nav>
}