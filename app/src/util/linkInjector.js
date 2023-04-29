import React from 'react'
import isURL from 'validator/es/lib/isURL.js'
import isAlphanumeric from 'validator/es/lib/isAlphanumeric.js'
import { Link } from 'react-router-dom'

const expression = /(\s+)/

const linkInjector = (str) => {
	let i = 0
	
	return str.split(expression).map((word) => {
		const index = `li-${i++}`
		
		if (word.startsWith('@') && isAlphanumeric(word.substr(1))) {
			return <Link to={`/@${word.substr(1)}`} key={index}>
				{word}
			</Link>
		} else if (word.startsWith('#') && isAlphanumeric(word.substr(1))) {
			return <Link to={`/tag/${word.substr(1)}`} key={index}>
				{word}
			</Link>
		} else if (isURL(word)) {
			return <a
				key={index}
				href={word}
				target="_blank"
				rel="noopener noreferrer"
			>
				{word}
			</a>
		} else {
			return <span key={index}>{word}</span>
		}
	})
}

export default linkInjector