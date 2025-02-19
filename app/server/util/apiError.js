// @version 1.0.0

class APIError extends Error {
	constructor(message, statusCode, details) {
		super(message)

		this.custom = true
		this.name = this.constructor.name
		this.statusCode = statusCode || 500
		this.details = details || {}
	}
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const errorMiddleware = (error, req, res, next) => {
	if (process.env.NODE_ENV !== 'production') {
		console.log(error.stack)
		console.error((error.custom || false), error)
	}

	if (!error.custom) {
		// Handle regular errors
		return res.status(500).send('Internal server error')
	}

	console.log('CUSTOM ERROR HANDLER')

	if (error.code === 'ECONNRESET' || error.details.requestAborted) {
		// Do not continue, client is no longer available
		return
	}

	res.status(error.statusCode).send(error.message)
}

export {
	APIError,
	errorMiddleware
}
