import statusMessage from '../constants/statusMessage'

export const apiMiddleware = () => (req, res, next) => {
	res.apiResult = (status, data) => {
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
	
	res.getFields = (query, respondToClient) => {
		const data = (
			typeof req.body.data !== 'undefined' && (req.body.data.data || req.body.data)
		) || req.query.data || req.query
		
		if (!data) return respondToClient && res.status(400).json({
			message: 'Missing fields'
		}) && false
		
		req.fields = {}
		
		for (let field in query) {
			if (data[query[field]] === undefined)
				return respondToClient && res.status(400).json({
					message: `Missing field: ${query[field]}`
				}) && false
			
			req.fields[query[field]] = data[query[field]]
		}
		
		return true
	}
	
	next()
}