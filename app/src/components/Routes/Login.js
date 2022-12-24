import React from 'react'
import { Link } from 'react-router-dom'

import AuthForm from '../../containers/AuthForm'
import Layout from '../Layout'

const inputs = [
	{
		type: 'email',
		name: 'username',
		label: 'Email',
		placeholder: 'email@example.com',
		autoFocus: true,
		validateFor: 'email',
		maxLength: 320
	},
	{
		type: 'password',
		name: 'password',
		label: 'Password',
		placeholder: '••••••••',
		validateFor: 'password',
		minLength: 4,
		maxLength: 999
	}
]

const Login = () => <Layout page="landing" disableFooter={true}>
	<section className="auth">
		<div className="box center-wrap">
			<div className="form-wrap">
				<Link to="/" className="btn-back" />
				<h3 className="heading">Sign In</h3>
				<AuthForm
					inputProps={inputs}
					apiUrl='http://localhost:81/v1/user/authenticate'
					redirect={true}
					redirectUrl='/'
				/>
				<div className="secondary-auth">
					don't have an account? <Link to="/signup">sign up</Link>
				</div>
			</div>
		</div>
	</section>
</Layout>

export default Login