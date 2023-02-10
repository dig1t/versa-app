import statusMessage from '../constants/statusMessage.js'

export const useFields = options => (req, res, next) => {
	if (!options || typeof options !== 'object') throw 'Missing options'
	
	const data = (
		typeof req.body.data !== 'undefined' && (req.body.data.data || req.body.data)
	) || req.query?.data || req.body
	
	if (!data) return res.status(400).json({
		message: 'Missing fields'
	})
	
	req.fields = {}
	
	if (options.fields) {
		for (let field in options.fields) {
			if (data[options.fields[field]] === undefined)
				return res.status(400).json({
					message: `Missing field: ${options.fields[field]}`
				})
			
			req.fields[options.fields[field]] = data[options.fields[field]]
		}
	}
	
	if (options.optionalFields) {
		for (let field in options.fields) {
			if (data[options.fields[field]] !== undefined) {
				req.fields[options.fields[field]] = data[options.fields[field]]
			}
		}
	}
	
	next()
}

export const apiMiddleware = () => (req, res, next) => {
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
	
	req.loginUser = data => new Promise((resolve, reject) => {
		if (!data) throw 'Missing user data'
		if (!data.grantId) throw 'Missing internal data'
		if (!data.refreshTokenId) throw 'Missing internal data'
		
		req.login(data, err => {
			req.session.grantId = data.grantId
			req.session.save()
			
			// Set httpOnly RefreshToken cookie
			res.cookie('vrt', data.refreshTokenId, {
				maxAge: 24 * 60 * 60 * 365,
				httpOnly: true,
				signed: true
			})
			
			err ? reject(err) : resolve()
		})
	})
	
	next()
}