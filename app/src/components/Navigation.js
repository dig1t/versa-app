import React from 'react'
import { Link } from 'react-router-dom'
import classNames from 'classnames'
import { useSelector } from 'react-redux'

import { useAuthenticated } from '../context/Auth.js'
import { isHydrated } from '../context/Hydration.js'
import { defaultAssets } from '../constants/assets.js'
import Avatar from '../features/User/components/Avatar.js'
import { Icon } from './UI/index.js'
import DropMenu, { ItemMenu, Item, ItemDivider } from './UI/DropMenu.js'
import Modal from './UI/Modal.js'
import PostEditor from '../containers/PostEditor.js'
import Logout from '../containers/Logout.js'

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
	const { loggedIn, userId } = useAuthenticated()
	
	const profileList = useSelector((state) => state.profiles.profileList)
	
	const profile = profileList[userId]
	
	const Menu = <ItemMenu>
		{profile && <Item link={`/@${profile.username}`}>My Profile</Item>}
		<ItemDivider />
		<Item link="/settings">Settings</Item>
		
		<li>
			<Logout />
		</li>
	</ItemMenu>
	
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
								</div>
							</div>
						</div>
					</Modal>
				</li>
			</ul>
			
			<ul className="shortcuts user-shortcuts">
				<li className="shortcut avatar">
					<DropMenu
						menu={Menu}
						sideOffset={-20}
						position='right'
					>
						{profile && <Avatar
							status="online"
							userId={profile.userId}
						/>}
					</DropMenu>
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