import React from 'react'
import Navigation from './Navigation'
import classNames from 'classnames'

export default class Layout extends React.Component {
	render() {
		const className = classNames('content', this.props.className)
		
		return <main>
			<Navigation mode={this.props.navMode} sticky={true} page={this.props.page} />
			<div className={className} page={this.props.page}>{this.props.children}</div>
		</main>
	}
}