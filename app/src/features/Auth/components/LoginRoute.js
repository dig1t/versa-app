import React from 'react'
import { useDispatch } from 'react-redux'
import { Link } from 'react-router-dom'

import AuthForm from './AuthForm.js'
import Layout from '../../Core/components/Layout.js'
import { setAuthenticatedUser, userLogout } from '../../User/store/actions/selfActions.js'

const inputs = [
	{
		type: 'email',
		name: 'email',
		label: 'Email',
		placeholder: 'email@example.com',
		autoFocus: true,
		validateFor: 'email',
		maxLength: 320,
		minLength: 1
	},
	{
		type: 'password',
		name: 'password',
		label: 'Password',
		placeholder: '••••••••',
		validateFor: 'password',
		minLength: 6,
		maxLength: 999
	}
]

const Login = () => {
	const dispatch = useDispatch()

	const handleResult = (success, data) => {
		dispatch(success ? setAuthenticatedUser(data) : userLogout())
	}

	return <Layout page="landing" disableNav={true} fullWidth={true}>
		<section className="auth">
			<div className="box center-wrap">
				<div className="form-wrap">
					<Link to="/" className="btn-back" />
					<h3 className="heading">Sign In</h3>
					<AuthForm
						inputs={inputs}
						apiUrl='/auth/login'
						redirect={true}
						redirectUrl='/home'
						handleResult={handleResult}
					/>
					<div className="secondary-auth">
						don't have an account? <Link to="/signup">sign up</Link>
					</div>
				</div>
			</div>
		</section>
	</Layout>
}

export default Login
