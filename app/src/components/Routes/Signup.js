import React from 'react'
import { Link } from 'react-router-dom'
import { useDispatch } from 'react-redux'

import AuthForm from '../../containers/AuthForm'
import Layout from '../Layout'
import { setAuthStatus, setAuthenticatedUser, setUserProfile } from '../../actions/user'
import { addUserProfile } from '../../actions/profile'

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

const Signup = () => {
	const dispatch = useDispatch()
	
	const handleResult = (success, data) => {
		console.log('signup success?', success)
		
		if (success) {
			console.log('DATA FROM SIGNUP SUCCESS', data)
			dispatch(setAuthenticatedUser(data.user))
			dispatch(setUserProfile(data.profile)) // replace with bottom function
			dispatch(addUserProfile(data.profile)) // add profile to cached profiles
		} else {
			dispatch(setAuthStatus(false))
		}
	}
	
	return <Layout page="landing" disableFooter={true}>
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
						handleResult={handleResult}
					/>
					<div className="secondary-auth">
						already have an account? <Link to="/login">sign in</Link>
					</div>
				</div>
			</div>
		</section>
	</Layout>
}

export default Signup