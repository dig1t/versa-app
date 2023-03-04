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
	if (typeof text === 'undefined') throw new Error('Util.validateText(): No text to validate')
	
	const exp = regexMap.get(validateFor)
	
	return exp ? exp.test(text) : text
}

const mongoValidate = (input, type) => {
	if (typeof input === 'undefined') throw new Error('Util.mongoValidate(): No input to validate')
	
	switch(type) {
		case 'id':
			return mongoose.isValidObjectId(input)
		case 'isObjectId':
			return input instanceof mongoose.Types.ObjectId
		default: {
			return true
		}
	}
}

const mongoSanitize = input => {
	if (typeof input === 'undefined') throw new Error('Util.mongoSanitize(): No input to sanitize')
	
	if (mongoValidate(input, 'isObjectId')) {
		const res = input.toHexString()
		
		// Expect res to be a string
		if (typeof res !== 'string') throw new Error('Util.mongoSanitize(): Unexpected error')
		
		return res
	} else if (typeof input === 'object') {
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

// Functions with 2+ MongoDB operations must be wrapped in mongoSession.
// If one operation fails, all the operations are rolled back.
// mongoSession resolves with whatever fn returns
const mongoSession = async fn => {
	if (typeof fn !== 'function') throw new Error('Util.mongoSession(): Missing function argument')
	
	const session = await mongoose.startSession()
	let res
	
	session.startTransaction()
	
	try {
		res = await fn()
		
		await session.commitTransaction()
		
		return res
	} catch(error) {
		await session.abortTransaction()
		
		throw error
	} finally {
		await session.endSession()
	}
}

const util = new Util()

util.validateText = validateText

export {
	validateText,
	mongoValidate,
	mongoSanitize,
	mongoSession
}

export default util