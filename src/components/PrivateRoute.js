import React from 'react'
import { connect } from 'react-redux'
import { Redirect, Route } from 'react-router'
// <Redirect to={this.state.redirectURL} push />

class PrivateRoute extends React.Component {
	constructor(props) {
		super(props)
	}
	
	render() {
		const {component, redirect, requireAuth, requireNoAuth, ...attributes} = this.props
		const canRender = (requireAuth && this.props.loggedIn) || (requireNoAuth && !this.props.loggedIn)
		
		return <Route {...attributes} render={props => {
			if (!canRender) {
				// staticContext prop is not defined on the client
				if (props.staticContext) props.staticContext.status = 302
				
				return <Redirect to={redirect} push />
			}
			
			return React.createElement(component, props)
		}} />
	}
}

const mapStateToProps = state => {
	return {
		loggedIn: state.user.loggedIn,
	}
}

export default connect(mapStateToProps)(PrivateRoute)