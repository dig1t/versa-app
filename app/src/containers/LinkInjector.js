import React, { useCallback, useEffect, useState } from 'react'
import isURL from 'validator/es/lib/isURL.js'
import isAlphanumeric from 'validator/es/lib/isAlphanumeric.js'
import { Link } from 'react-router-dom'

import Emojify from './Emojify.js'

const expression = /(\s+)/

const LinkInjector = ({ text }) => {
	const [result, setResult] = useState([])
	
	const LinkComponent = ({ word, prefix }) => {
		return (<Link to={`${prefix}${word.substr(1)}`}>
			{word}
		</Link>)
	}
	
	const AnchorComponent = ({ word }) => {
		return (<a
			href={word}
			target="_blank"
			rel="noopener noreferrer"
		>
			{word}
		</a>)
	}
	
	const WordComponent = ({ word }) => {
		const lineBreaks = word.split('\n')
		
		return lineBreaks.map((wordChunk, breakIndex) => (<>
			<Emojify>
				<span>{wordChunk}</span>
			</Emojify>
			{breakIndex < lineBreaks.length - 1 && <br />}
		</>))
	}
	
	useEffect(() => {
		let i = 0
		let wordGroup = []
		const compiled = []
		
		const processWordGroup = () => {
			if (wordGroup.length <= 0) return
			
			compiled.push(<WordComponent word={wordGroup.join('')} />)
			
			wordGroup = []
		}
		
		for (let word of text.split(expression)) {
			const index = `li-${i++}`
			
			if (word.startsWith('@') && isAlphanumeric(word.substr(1))) {
				processWordGroup(index)
				compiled.push(<LinkComponent word={word} prefix="/@" />)
			} else if (word.startsWith('#') && isAlphanumeric(word.substr(1))) {
				processWordGroup(index)
				compiled.push(<LinkComponent word={word} prefix="/tag/" />)
			} else if (isURL(word)) {
				processWordGroup(index)
				compiled.push(<AnchorComponent word={word} />)
			} else {
				wordGroup.push(word)
				
				if (!text.match(expression)) {
					compiled.push(<WordComponent word={wordGroup.join('')} />)
				}
			}
		}
		
		processWordGroup()
		setResult(compiled)
	}, [])
	
	return <>{result}</>
}

LinkInjector.defaultProps = {
	text: ''
}

export default LinkInjector