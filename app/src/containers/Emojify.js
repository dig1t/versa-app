import React, { useEffect, useRef } from 'react'
import { Children } from 'react'
import PropTypes from 'prop-types'
import twemoji from 'twemoji'

const options = {
	ext: '.svg',
	folder: '/svg',
	base: 'assets/i/emoji',
	className: 'emoji'
}

const Emojify = ({ children }) => {
	const childrenRefs = useRef([])
	
	useEffect(() => {
		const parseTwemoji = () => {
			Object.values(childrenRefs.current).forEach((ref) => {
				const node = ref.current
				
				twemoji.parse(node, options)
			})
		}
		
		parseTwemoji()
	}, [])
	
	return <>
		{Children.map(children, (child, index) => {
			if (typeof child === 'string') {
				console.warn(`Twemoji can't parse string child when noWrapper is set. Skipping child "${child}"`)
				return child
			}
			
			childrenRefs.current[index] = childrenRefs.current[index] || useRef(null)
			
			return React.cloneElement(child, { ref: childrenRefs.current[index] })
		})}
	</>
}

Emojify.propTypes = {
	children: PropTypes.node,
	options: PropTypes.object,
	tag: PropTypes.string
}

export default Emojify