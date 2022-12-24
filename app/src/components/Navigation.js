import React from 'react'
import { Link } from 'react-router-dom'
import classNames from 'classnames'

//import { BurgerMenu } from './UI'

const links = [
	//['/', 'Home']
]

const Navigation = props => {
	return <nav
		className={classNames(props.classNames)}
		role="navigation"
	>
		<div className="placeholder"></div>
		<div className="box p-x-3">
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
					<Link to="/signup" className="btn btn-round btn-primary">SIGN UP</Link>
				</li>
			</ul>
		</div>
	</nav>
}

export default Navigation