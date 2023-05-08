import React, { useRef } from 'react'
import { Children } from 'react'
import twemoji from 'twemoji'

const options = {
	ext: '.svg',
	folder: 'svg',
	base: 'twemoji/assets'
}

const Emojify = ({ children }) => {
	return <>
		{Children.map(children, (child) => {
			return twemoji.parse(child, options)
		})}
	</>
}

export default Emojify