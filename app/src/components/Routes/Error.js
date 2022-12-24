import React from 'react'
import { Link } from 'react-router-dom'

import Layout from '../Layout'

const Error = () => <Layout page="error">
	<div className="error-page align-center-wrap">
		<div className="text">404</div>
		<Link to="/">return home</Link>
	</div>
</Layout>

export default Error