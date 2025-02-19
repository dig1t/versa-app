import mongoose from 'mongoose'

export const mongoValidate = (input, type) => {
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

export const ObjectIdToString = (input) => {
	if (input instanceof mongoose.Types.ObjectId) {
		return input.toHexString()
	} else if (typeof(input) === 'string') {
		return input
	} else if (input === undefined || input === null) {
		return
	} else {
		throw new Error('mongoHelpers.ObjectIdToString(): Invalid input')
	}
}

export const mongoSanitize = (input) => {
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
// If one operation fails, all operations are rolled back.
// mongoSession resolves with whatever fn returns
export const mongoSession = async (fn) => {
	if (typeof fn !== 'function') throw new Error('Util.mongoSession(): Missing function argument')

	const session = await mongoose.startSession()
	let res

	session.startTransaction()

	try {
		res = await fn()

		await session.commitTransaction()
		await session.endSession()

		return res
	} catch(error) {
		await session.abortTransaction()
		await session.endSession()

		throw error
	}
}
