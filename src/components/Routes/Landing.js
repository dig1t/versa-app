import React from 'react'
import Layout from '../Layout'
//import Navigation from '../Navigation'

import Footer from '../Footer'

export default class Landing extends React.Component {
	// stickyNav = <Navigation page="/" mode="dark" sticky={false} />
	
	render() {
		return <Layout className="landing" page={this.props.location.pathname}>
			<section className="hero">
				<div className="box align-wrap">
					<div className="grid">
						<div className="gi-xl">
							<p>Hello World</p>
						</div>	
					</div>
				</div>
			</section>
			<Footer/>
		</Layout>
	}
}