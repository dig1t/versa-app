import React from 'react'
import { Link } from 'react-router-dom'

import Layout from '../Layout.js'

const Landing = () => <Layout page="landing" disableNav={true}>
	<section className="hero">
		<div className="box align-center-wrap">
			<div>
				<img src="/assets/i/landing/landing-mockup.png" />
			</div>
			<div>
				<div className="icon icon-full-width icon-logo" />
				<p>your new home</p>
				<Link to="/signup" className="cta-primary">SIGN UP</Link>
				<Link to="/login" className="cta-secondary">login to your account</Link>
				<img src="/assets/i/landing/app-stores.png" />
			</div>
		</div>
	</section>
</Layout>

export default Landing