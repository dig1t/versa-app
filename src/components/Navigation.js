import React from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import classNames from 'classnames'

//import { BurgerMenu } from './UI'

const links = [
	['/', 'Home'],
	['/faq', 'FAQ'],
	['/blog', 'Blog']
]

const RightNavigation = props => {
	return props.loggedIn ? <>
		<li>
			<Link to="/my/profile" className="btn btn-round btn-secondary">PROFILE</Link>
		</li>
	</> : <>
	<li>
		<Link to="/login" className="btn btn-round btn-secondary">LOGIN</Link>
	</li>
	<li>
		<Link to="/cta" className="btn btn-round btn-primary">CTA</Link>
	</li>
	</>
}

class Navigation extends React.Component {
	render() {
		const logoClassName = classNames(
			'icon',
			'icon-logo' + (this.props.mode === 'dark' ? '--white' : '')
		)
		
		return <nav className={classNames(this.props.mode, {sticky:this.props.sticky ? this.props.sticky : false})} role="navigation">
			<div className="placeholder"></div>
			<div className="box">
				<ul className="align-wrap float-left">
					<li className="logo">
						<Link className={logoClassName} to="/"></Link>
					</li>
					{links.map(link => {
						const className = classNames('nav-btn', {
							active: this.props.page === link[0]
						})
						
						return <li key={link[0]} className={className}>
							<Link to={link[0]}>{link[1]}</Link>
						</li>
					})}
				</ul>
				<ul className="align-wrap float-right">
					<RightNavigation loggedIn={this.props.loggedIn} />
				</ul>
			</div>
		</nav>
	}
}

const mapStateToProps = state => {
	return {
		loggedIn: state.user.loggedIn,
	}
}

export default connect(mapStateToProps)(Navigation)