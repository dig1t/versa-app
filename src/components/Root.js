import React from 'react'
import { connect } from 'react-redux'

import Routes from './Routes'

import { fetchUserData } from '../actions/user'

class Root extends React.Component {
	constructor(props) {
		super(props)
	}
	
	componentDidMount() {
		// run all one-time redux actions
		if (typeof window === 'undefined') return
		
		this.props.user.loggedIn && typeof this.props.user.profile.userId !== 'undefined' && this.props.dispatch(fetchUserData())
	}
	
	render() {
		return <Routes />
	}
}

const mapStateToProps = state => {
	return {
		user: state.user
	}
}

export default connect(mapStateToProps)(Root)