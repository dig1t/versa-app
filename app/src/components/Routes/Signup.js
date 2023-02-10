import React from 'react'
import { Link } from 'react-router-dom'
import { useDispatch } from 'react-redux'

import AuthForm from '../../containers/AuthForm.js'
import Layout from '../Layout.js'
import { setAuthenticatedUser, setUserProfile, userLogout } from '../../actions/user.js'
import { addUserProfile } from '../../actions/profile.js'

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
		if (success) {
			dispatch(setAuthenticatedUser(data.user))
			dispatch(setUserProfile(data.profile)) // replace with bottom function
			dispatch(addUserProfile(data.profile)) // add profile to cached profiles
		} else {
			dispatch(userLogout())
		}
	}
	
	return <Layout page="landing">
		<section className="auth">
			<div className="box center-wrap">
				<div className="form-wrap">
					<Link to="/" className="btn-back" />
					<h3 className="heading">Sign Up</h3>
					<AuthForm
						inputProps={inputs}
						apiUrl='/auth/signup'
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