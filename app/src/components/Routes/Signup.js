import React from 'react'
import { Link } from 'react-router-dom'

import AuthForm from '../../containers/AuthForm'
import Layout from '../Layout'

const inputs = [
	{
		type: 'email',
		name: 'email',
		label: 'Email',
		placeholder: 'email@example.com',
		autoFocus: true,
		validateFor: 'email',
		maxLength: 320
	},
	{
		type: 'text',
		name: 'name',
		label: 'Name',
		placeholder: 'John Doe',
		autoFocus: true,
		validateFor: 'text',
		maxLength: 20
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
				<h3 className="heading">Sign Up</h3>
				<AuthForm
					inputProps={inputs}
					apiUrl='http://localhost:81/v1/user/new'
					redirect={true}
					redirectUrl='/'
					buttonText='REGISTER'
				/>
				<div className="secondary-auth">
					already have an account? <Link to="/login">sign in</Link>
				</div>
			</div>
		</div>
	</section>
</Layout>

export default Login