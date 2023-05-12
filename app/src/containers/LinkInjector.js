import React, { useCallback, useEffect, useState } from 'react'
import isURL from 'validator/es/lib/isURL.js'
import isAlphanumeric from 'validator/es/lib/isAlphanumeric.js'
import { Link } from 'react-router-dom'

import Emojify from './Emojify.js'

const expression = /(\s+)/

const LinkInjector = ({ text }) => {
	let i = 0
	let wordGroup = []
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
	
	const processWordGroup = () => {
		if (wordGroup.length <= 0) return
		
		setResult(prevState => [...prevState, <WordComponent word={wordGroup.join('')} />])
		
		wordGroup = []
	}
	
	useEffect(() => {
		console.log('start')
		
		for (let word of text.split(expression)) {
			const index = `li-${i++}`
			
			console.log('word', word)
			
			if (word.startsWith('@') && isAlphanumeric(word.substr(1))) {
				processWordGroup(index)
				
				setResult(prevState => [...prevState, <LinkComponent word={word} prefix="/@" />])
			} else if (word.startsWith('#') && isAlphanumeric(word.substr(1))) {
				processWordGroup(index)
				
				setResult(prevState => [...prevState, <LinkComponent word={word} prefix="/tag/" />])
			} else if (isURL(word)) {
				processWordGroup(index)
				console.log(1)
				
				setResult(prevState => [...prevState, <AnchorComponent word={word} />])
			} else {
				wordGroup.push(word)
				console.log('pushed word', word)
				
				if (!text.match(expression)) {
					console.log(911)
					setResult(prevState => [
						...prevState,
						<WordComponent word={wordGroup.join('')} />
					])
				}
			}
		}
		
		processWordGroup()
		setResult(prevState => {
			console.log('prevState', prevState)
			return prevState
		})
		console.log('end', result)
		
		return () => setResult([])
	}, [])
	
	return <>{result}</>
}

LinkInjector.defaultProps = {
	text: ''
}

export default LinkInjector