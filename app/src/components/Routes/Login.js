import React from 'react'
import { useDispatch } from 'react-redux'
import { Link } from 'react-router-dom'

import AuthForm from '../../containers/AuthForm'
import Layout from '../Layout'
import { setAuthStatus, setAuthenticatedUser } from '../../actions/user'

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
		type: 'password',
		name: 'password',
		label: 'Password',
		placeholder: '••••••••',
		validateFor: 'password',
		minLength: 4,
		maxLength: 999
	}
]

const Login = () => {
	const dispatch = useDispatch()
	
	const handleResult = (success, data) => {
		console.log('login success?', success)
		console.log('DATA FROM LOGIN', data)
		
		dispatch(success ? setAuthenticatedUser(data) : setAuthStatus(false))
	}
	
	return <Layout page="landing" disableFooter={true}>
		<section className="auth">
			<div className="box center-wrap">
				<div className="form-wrap">
					<Link to="/" className="btn-back" />
					<h3 className="heading">Sign In</h3>
					<AuthForm
						inputProps={inputs}
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