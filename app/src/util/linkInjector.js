import { Link } from 'react-router-dom'

import isURL from 'validator/lib/isURL'
import isAlphanumeric from 'validator/lib/isAlphanumeric'

const expression = /(\s+)/

const linkInjector = (str) => {
	const words = str.split(expression).map(word => {
		if (word.startsWith('@') && isAlphanumeric(word.substr(1))) {
			return <Link to={`/@${word.substr(1)}`}>{word}</Link>
		} else if (word.startsWith('#') && isAlphanumeric(word.substr(1))) {
			return <Link to={`/tag/${word.substr(1)}`}>{word}</Link>
		} else if (isURL(word)) {
			return <a href={word} target="_blank" rel="noopener noreferrer">{word}</a>
		} else {
			return word
		}
	})
	return words
}

export default linkInjector