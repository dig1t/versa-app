import statusMessage from '../constants/statusMessage.js'

export default () => (req, res, next) => {
	req.apiResult = (status, data) => {
		const success = status == 200
		const message = data?.message
		
		if (message) data.message = undefined
		
		res.status(status || 200).json({
			success,
			data: success ? data : undefined,
			message: message ? (
				// if resulting message is a thrown error, convert it to a string
				(typeof(message) === 'string') ? message : message.toString()
			) : statusMessage[status] // if no message, give a status message
		})
	}
	
	next()
}