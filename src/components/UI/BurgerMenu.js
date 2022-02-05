import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'

export default class BurgerMenu extends React.Component {
	static propTypes = {
		open: PropTypes.element.bool
	}
	
	static state = {
		open: false
	}
	
	toggle() {
		this.setState({open: !this.state.open})
	}
	
	render() {
    const className = classNames('nav-toggle', 'hamburger', (this.state.open && 'active'))
    
		return <div className={className} onClick={this.toggle}><i /></div>
	}
}