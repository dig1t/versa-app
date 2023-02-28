import mongoose from 'mongoose'

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

const mongoValidate = (input, type) => {
	switch(type) {
		case 'id':
			return mongoose.isValidObjectId(input)
		default: {
			return true
		}
	}
}

const mongoSanitize = input => {
	if (typeof input === 'object') {
		for (let key in input) {
			if (/^\$/.test(key)) {
				delete input[key]
			} else {
				mongoSanitize(input[key])
			}
		}
	}
	
	return input
}

const util = new Util()

util.validateText = validateText

export {
	validateText,
	mongoValidate,
	mongoSanitize
}

export default util