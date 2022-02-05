import React from 'react'
import ReactDOM from 'react-dom'
import PropTypes from 'prop-types'
import classNames from 'classnames'

/* TODO: add more modal types such as:
** video, text, confirmation popups,
** custom modals (newsletters, login) */
class Modal extends React.Component {
	constructor(props) {
		super(props)
	}
	
	getHeader() {
		let show = false
		
		return show ? (<div className="header">{this.props.title}</div>) : null
	}
	
	getFooter() {
		let show = false
		
		switch(this.props.type) {
			case 'image': {
				show = true
				break
			}
		}
		
		return show ? (<div className="footer">
			<div className="heading">{this.props.title}</div>
			<p>{this.props.description}</p>
		</div>) : null
	}
	
	modalComponent() {
		let content = this.props.children
		
		switch(this.props.type) {
			case 'image': {
				content = <img src={this.props.image} alt={this.props.imgAlt} />
				break
			}
		}
		
		const className = classNames('modal', 'modal-' + this.props.type)
		
		return !this.props.open ? null : <div className={className}>
			<div className="background-close" onClick={this.props.toggleModal} />
			<button className="close fas fa-times" onClick={this.props.toggleModal} />
			<div className="align">
				<div className="container">
					<div className="main">
						{ this.getHeader() }
						<div className="content">{content}</div>
						{ this.getFooter() }
					</div>
				</div>
			</div>
		</div>
	}
	
	render() {
		// prevent errors when server-side rendering by returning null
		return typeof window !== 'undefined' ? ReactDOM.createPortal(
			this.modalComponent(),
			document.getElementById('modal-root')
		) : null
	}
}

Modal.defaultProps = {
	open: false
}

Modal.propTypes = {
	open: PropTypes.bool.isRequired
}

export default Modal