// @version 1.0.1

import isEmail from 'validator/lib/isEmail.js'
import isURL from 'validator/lib/isURL.js'
import isAlphanumeric from 'validator/lib/isAlphanumeric.js'

const validationMap = new Map([
	['number', /^[0-9]+$/],
	['username', /^[a-zA-Z0-9_]+$/],
	['id', /^[a-zA-Z0-9]+$/],
	['name', /^.+$/],
	['password', /^[a-zA-Z0-9 ~`!@#$%^&*()_+\-=[\]\\{}|;':",./<>?]+$/],
	['phone', /^\+?(?:\d ?)\d{6,14}$/],
	['us-phone', /^\+?[01]?[- ]?\(?\d{3}\)?[- ]?\d{3}[- ]?\d{4}$/],
	['text', /^[a-zA-Z0-9 ~`!@#$%^&*()_+\-=[\]\\{}|;':",./<>?\p{Emoji_Presentation}]+$/um]
])

const validateText = (text, validateFor) => {
	switch(validateFor) {
		case 'email': {
			return isEmail(text)
		}
		case 'text': case 'textarea': {
			return validationMap.get('text').test(
				// eslint-disable-next-line no-control-regex
				text.normalize('NFD').replace(/[^\u0000-\u007E]/g, '')
			)
		}
		/*case 'name': {
			return isAlphanumeric(text, 'en-US')
		}*/
		case 'url': {
			return isURL(text, {
				protocols: ['http', 'https']
			})
		}
		default: { // Regex
			const regex = validationMap.get(validateFor)

			return regex === undefined ? text : regex.test(text)
		}
	}
}

export default validateText
