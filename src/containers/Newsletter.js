import React from 'react'
import { connect } from 'react-redux'
import { Redirect } from 'react-router'
import axios from 'axios'

class Newsletter extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			form: {
				email: ''
			},
			
			okToPost: false,
			redirect: false
		}
		
		this.handleInputChange = this.handleInputChange.bind(this)
	}
	
	handleInputChange(event) {
		const target = event.target
		
		this.setState({
			form: {
				...this.state.form,
				[target.name]: target.type === 'checkbox' ? target.checked : target.value
			}
		})
	}
	
	handleSubmit(event) {
		event.preventDefault()
		
		// only post if all inputs are valid
		if (this.state.okToPost) axios.post('/api/newsletter/signup', this.state.form, {
				headers: {'Content-Type': 'application/json'}
			})
			.then((response) => {
				response.data.success ? this.setState({ redirect: true }) : this.setState({ authError: true, authMessage: response.data.message })
			})
			.catch((error) => {
				console.error(error)
			})
	}
	
	render() {
		return <>
	  	<div className="newsletter-head">Join our newsletter for special discounts</div>
	  	<form className="newsletter-form" onSubmit={this.handleSubmit.bind(this)}>
				{this.state.redirect ? (<Redirect to="/" push />) : null}
				<input type="email" name="email" placeholder="E-mail"  value={this.state.email} onChange={this.handleInputChange}/>
				<button type="submit" disabled={!this.state.okToPost}>Sign up</button>
	  	</form>
		</>
	}
}

export default connect()(Newsletter)