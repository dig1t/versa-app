import React from 'react'
import Layout from '../Layout'
import { Link } from 'react-router-dom'
import Footer from '../Footer'

export default class Error extends React.Component {
	renderComponent() {
		return <>
			<div className="error-page align-wrap">
				<div className="text">404</div>
				<Link to="/">return home</Link>
			</div>
			<Footer/>
		</>
	}
	
	render() {
		return <Layout page="/error">{this.renderComponent()}</Layout>
	}
}