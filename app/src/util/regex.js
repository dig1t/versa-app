import { Link } from 'react-router-dom'

import { regexMatch } from '../constants/regex'

export const highlighter = (text) => {
	return text.replace(regexMatch.username, match => {
		return <Link to={'/' + match}>{ match }</Link>
	})
}