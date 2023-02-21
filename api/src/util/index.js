const version = '1.0.0'

const Util = function() {
	this.version = version
}

// SECURITY

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
	['us-phone', /^\+?[01]?[- ]?\(?\d{3}\)?[- ]?\d{3}[- ]?\d{4}$/]
])

const validateText = (text, validateFor) => {
	const exp = regexMap.get(validateFor)
	
	return exp ? exp.test(text) : text
}

const util = new Util()

util.validateText = validateText

export {
	validateText
}

export default util