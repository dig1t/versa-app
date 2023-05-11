import React from 'react'
import isURL from 'validator/es/lib/isURL.js'
import isAlphanumeric from 'validator/es/lib/isAlphanumeric.js'
import { Link } from 'react-router-dom'

import Emojify from '../containers/Emojify.js'

const expression = /(\s+)/

const createLinkComponent = (word, prefix, index) => {
	return (<Link to={`${prefix}${word.substr(1)}`} key={index}>
		{word}
	</Link>)
}

const createAnchorComponent = (word, index) => {
	return (<a
		key={index}
		href={word}
		target="_blank"
		rel="noopener noreferrer"
	>
		{word}
	</a>)
}

const createWordComponent = (word, index) => {
	const lineBreaks = word.split('\n')
	
	return <React.Fragment key={index}>
		{lineBreaks.map((wordChunk, breakIndex) => {
			return <>
				<Emojify>
					<span>{wordChunk}</span>
				</Emojify>
				{breakIndex < lineBreaks.length - 1 && <br />}
			</>
		})}
	</React.Fragment>
}

const linkInjector = (str) => {
	let i = 0
	let wordGroup = []
	const result = []
	
	const processWordGroup = (index) => {
		if (wordGroup.length <= 0) return
		
		result.push(createWordComponent(wordGroup.join(''), index))
		wordGroup = []
	}
	
	for (let word of str.split(expression)) {
		const index = `li-${i++}`
			console.log('word', word)
		
		if (word.startsWith('@') && isAlphanumeric(word.substr(1))) {
			processWordGroup(index)
			
			result.push(createLinkComponent(word, '/@', index))
		} else if (word.startsWith('#') && isAlphanumeric(word.substr(1))) {
			processWordGroup(index)
			
			result.push(createLinkComponent(word, '/tag/', index))
		} else if (isURL(word)) {
			processWordGroup(index)
			
			result.push(createAnchorComponent(word, index))
		} else {
			wordGroup.push(word)
			console.log('pushed word', word)
			
			if (!str.match(expression)) {
				console.log(911)
				result.push(createWordComponent(wordGroup.join(''), index))
			}
		}
	}
	
	processWordGroup(`li-${i}`)
	
	console.log(result)
	console.log('------------------')
	return result
}

export default linkInjector