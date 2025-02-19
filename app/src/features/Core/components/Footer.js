import React from 'react'
import { Link } from 'react-router-dom'

/*
const links = [
	['/search', 'Search'],
	['/friends', 'Friends'],
	['/inbox', 'Inbox'],
	['/servers', 'Servers']
]
*/

const links = [
	['/', 'Home'],
	['/friends', 'Friends'],
	//['/faq', 'FAQ'],
	//['/contact', 'Contact'],
	//['/legal', 'Legal'],
	//['/privacy', 'Privacy']
]

const LinksContainer = () => <div className="grid text-center">
	{links.map((link) => <div key={link[0]} className="col-12 p-y-1">
		<Link to={link[0]}>{link[1]}</Link>
	</div>)}
</div>

const Footer = () => <footer className="p-y-2">
	<div className="grid">
		<div className="col-6 offset-1">
			<div className="col-12">
				<LinksContainer/>
			</div>
		</div>
		<div className="col-4">
			<div className="info text-center">
				<p className="m-y-1">
					<i className="fas fa-envelope"></i> help@versaapp.co
				</p>
			</div>
		</div>
		<div className="col-10 offset-1 copyright text-center font-size-10 p-1">©{(new Date()).getFullYear()} Versa</div>
	</div>
</footer>

export default Footer
