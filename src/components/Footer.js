import React from 'react'
import { Link } from 'react-router-dom'

import SocialLinks from './SocialLinks'
//import Newsletter from '../containers/Newsletter'

const links = [
	['/', 'Home'],
	//['/blog', 'Blog'],
	//['/faq', 'FAQ'],
	//['/contact', 'Contact'],
	//['/legal', 'Legal'],
	//['/privacy', 'Privacy']
]

class LinksContainer extends React.Component {
	render() {
		return <ul className="links">
			{links.map(link => <li key={link[0]}>
				<Link to={link[0]}>{link[1]}</Link>
			</li>)}
		</ul>
	}
}

export default class Footer extends React.Component {
	render() {
		return <footer>
			<div className="grid">
				<div className="gi-6 grid-push-1">
					<i className="gi-12 icon icon-logo--gray"/>
					<div className="gi-12">
						<LinksContainer/>
					</div>
				</div>
				<div className="gi-4">
					<SocialLinks />
					{ /*<Newsletter/>*/ }
					<div className="info">
						<p><i className="fas fa-envelope"></i> contact@javierm.net</p>
						<p style={{display:'none'}}><i className="fas fa-phone fa-flip-horizontal"></i> +1-773-290-9269</p>
					</div>
				</div>
			</div>
			<div className="copyright">©{(new Date()).getFullYear()} JM Tech, LLC</div>
		</footer>
	}
}