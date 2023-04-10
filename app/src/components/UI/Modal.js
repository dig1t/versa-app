import React, { useMemo, useState } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'

import Portal from './Portal.js'

const Modal = props => {
	const { open, type, toggleModal } = props
	
	const modalComponent = useMemo(() => {
		switch(props.type) {
			case 'image': {
				// eslint-disable-next-line
				return <img src={props.image} alt={props.imgAlt} />
			}
			default:
				return props.component
		}
	}, [props])
	
	return <Portal>
		{open && <div
			className={classNames('modal', `modal-${type}`)}
		>
			<div
				className="background-close"
				role="button"
				onClick={toggleModal}
			/>
			<button
				className="close fas fa-times"
				onClick={toggleModal}
			/>
			<div className="center-wrap">
				<div className="container">
					<div className="main">
						<div className="content">{modalComponent}</div>
					</div>
				</div>
			</div>
		</div>}
	</Portal>
}

Modal.propTypes = {
	open: PropTypes.bool.isRequired,
	type: PropTypes.string,
	toggleModal: PropTypes.func.isRequired
}

const ModalWrap = props => {
	if (props.inlineTrigger === false && typeof props.open !== Boolean) {
		throw new Error('ModalWrap - Custom triggers must include an "open" prop')
	}
	
	const [open, setOpen] = useState(false)
	
	return props.inlineTrigger ? <>
		<Modal
			{...props}
			toggleModal={input => {
				input.preventDefault()
				input.stopPropagation()
				
				setOpen(!open)
			}}
			open={open}
		/>
		<span onClick={() => setOpen(true)} >{props.children}</span>
	</> : props.children
}

ModalWrap.defaultProps = {
	inlineTrigger: true
}

ModalWrap.propTypes = {
	type: PropTypes.string,
	component: PropTypes.object,
	inlineTrigger: PropTypes.bool
}

export { Modal }
export default ModalWrap