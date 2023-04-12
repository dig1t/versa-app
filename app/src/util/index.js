import isEmail from 'validator/lib/isEmail'
import isURL from 'validator/lib/isURL'
import isAlphanumeric from 'validator/lib/isAlphanumeric'

const version = '1.0.1'

const Util = function() {
	this.version = version
}

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
			return validationMap.get('text').test(text.normalize('NFD'))
		}
		case 'name': {
			return isAlphanumeric(text, 'en-US')
		}
		case 'url': {
			return isURL(text, {
				protocols: ['http', 'https']
			})
		}
		case (typeof validationMap.get(validateFor) === 'undefined'): {
			return text
		}
		default: { // Regex
			return validationMap.get(validateFor).test(text)
		}
	}
}

const binarySearch = (array, value) => {
	let min = 0
	let max = array.length - 1
	
	while (min <= max) {
		const mid = (min + max) >> 1
		
		if (array[mid] === value) {
			return mid
		} else if (array[mid] < value) {
			min = mid + 1
		} else {
			max = mid -1
		}
	}
	
	return -1
}

const binarySearchArrayChild = (array, key, value) => {
	let min = 0
	let max = array.length - 1
	
	while (min <= max) {
		const mid = (min + max) >> 1
		
		if (array[mid][key] === value) {
			return mid
		} else if (array[mid].key < value) {
			min = mid + 1
		} else {
			max = mid -1
		}
	}
	
	return -1
}

const util = new Util()

util.validateText = validateText
util.binarySearch = binarySearch
util.binarySearchArrayChild = binarySearchArrayChild

export {
	validateText,
	binarySearch,
	binarySearchArrayChild
}

export default util