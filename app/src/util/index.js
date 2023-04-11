const version = '1.0.1'

const Util = function() {
	this.version = version
}

const regexMap = new Map([
	['number', /^[0-9]+$/],
	['text', /^.+$/],
	['username', /^[a-zA-Z0-9_]+$/],
	['id', /^[a-zA-Z0-9]+$/],
	['textarea', /^.+$/gm],
	['name', /^.+$/], // replace in future?
	['email', /.+@.+\..+/],
	['password', /^[a-zA-Z0-9 ~`!@#$%^&*()_+\-=[\]\\{}|;':",./<>?]+$/],
	['phone', /^\+?(?:\d ?)\d{6,14}$/],
	['us-phone', /^\+?[01]?[- ]?\(?\d{3}\)?[- ]?\d{3}[- ]?\d{4}$/],
	['url', /^(?:https?:\/\/)?[^\s/$.?#]+\.[^\s]+$/]
])

const validateText = (text, validateFor) => {
	const exp = regexMap.get(validateFor)
	
	return exp ? exp.test(text) : text
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