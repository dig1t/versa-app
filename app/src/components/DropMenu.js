import React, { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import PropTypes from 'prop-types'
import classNames from 'classnames'

import Portal from './Portal.js'

const ItemMenu = ({ children }) => {
	return <ul className="menu">{children}</ul>
}

const MenuLink = ({ link, children }) => {
	return <li>
		<Link to={link}>{children}</Link>
	</li>
}

MenuLink.propTypes = {
	link: PropTypes.string
}

MenuLink.propTypes = {
	link: PropTypes.string
}

const MenuItem = ({ children, className, color, caution, ...props }) => (
	<li
		className={classNames(
			className,
			'menu-btn',
			caution && 'caution',
			{ [`text-${color}`]: color }
		)}
		{...props}
	>
		{children}
	</li>
)

const MenuDivider = () => <li className="divider" />

const Menu = (props, ref) => {
	const menuElement = useRef()
	const [pos, setPos] = useState({ x: 0, y: 0 })

	useEffect(() => {
		if (!menuElement.current || !props.parentRef.current) return

		const parentRect = props.parentRef.current.getBoundingClientRect()

		const width = menuElement.current.offsetWidth
		const height = menuElement.current.offsetHeight

		let x = parentRect.left + (parentRect.width / 2) - (width / 2) + props.sideOffset
		let y = parentRect.top - height - props.offset

		if (props.position === 'bottom' || (!props.position && y < 0)) {
			y = parentRect.top + parentRect.height + props.offset
			x = (parentRect.left + (parentRect.width / 2)) - (width / 2) - props.sideOffset
		}

		if (props.position === 'left' || (!props.position && (
			// eslint-disable-next-line no-undef
			x > window.innerWidth || menuElement.current.offsetWidth + x > window.innerWidth
		))) {
			x = parentRect.left - width - props.offset
			y = parentRect.top - (height / 2) + (parentRect.height / 2) - props.sideOffset
		}

		if (props.position === 'right' || (!props.position && (
			// eslint-disable-next-line no-undef
			x < 0 || menuElement.current.offsetWidth + x > window.innerWidth
		))) {
			x = parentRect.left + parentRect.width + props.offset
			y = parentRect.top - (height / 2) + (parentRect.height / 2) + props.sideOffset
		}

		setPos({ x, y })
	}, [props, menuElement, ref])

	return <Portal active={props.open}>
		{props.open && <div className={classNames('drop-menu')}>
			<div
				className="background-close"
				role="button"
				onClick={(input) => props.toggleMenu(input)}
			/>
			<div
				ref={menuElement}
				className="menu-container"
				style={{ left: pos.x, top: pos.y }}
				onClick={(input) => props.toggleMenu(input)}
			>
				{props.menu}
			</div>
		</div>}
	</Portal>
}

Menu.defaultProps = {
	offset: 10,
	sideOffset: 0
}

Menu.propTypes = {
	open: PropTypes.bool.isRequired,
	menu: PropTypes.object.isRequired,
	parentRef: PropTypes.object.isRequired,
	toggleMenu: PropTypes.func.isRequired,
	position: PropTypes.string,
	offset: PropTypes.number
}

const DropMenu = (props) => {
	if (props.inlineTrigger === false && typeof props.open !== Boolean) {
		throw new Error('TooltipWrap - Custom triggers must include an "open" prop')
	}

	const [open, setOpen] = useState(false)
	const ref = useRef()

	return <>
		<span
			className={classNames(
				'ui-action drop-menu-trigger',
				props.keepActive && open && 'active'
			)}
			ref={ref}
			onClick={() => setOpen(true)}
		>{props.children}</span>
		<Menu
			{...props}
			parentRef={ref}
			toggleMenu={(input) => {
				input.preventDefault()
				input.stopPropagation()

				setOpen(!open)
			}}
			open={open}
		/>
	</>
}

DropMenu.defaultProps = {
	inlineTrigger: true,
	keepActive: true
}

DropMenu.propTypes = {
	menu: PropTypes.object.isRequired,
	keepActive: PropTypes.bool,
}

export default {
	Menu: DropMenu,
	ItemMenu,
	Link: MenuLink,
	Item: MenuItem,
	Divider: MenuDivider
}
