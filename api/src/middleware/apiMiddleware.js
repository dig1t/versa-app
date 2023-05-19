// @version 1.0.0

// @reference https://en.wikipedia.org/wiki/List_of_HTTP_status_codes
const statusMessage = {
	200: 'OK',
	400: 'Bad Request',
	401: 'Unauthorized',
	402: 'Payment Required',
	403: 'Forbidden',
	404: 'Not Found',
	405: 'Method Not Allowed',
	406: 'Not Acceptable',
	408: 'Request Timeout',
	409: 'Conflict',
	410: 'Gone',
	415: 'Unsupported Media Type',
	418: 'I\'m a teapot',
	423: 'Locked',
	500: 'Internal Server Error',
	501: 'Not Implemented',
	502: 'Bad Gateway',
	503: 'Service Unavailable',
	504: 'Gateway Timeout',
	505: 'HTTP Version Not Supported'
}

const defaultOptions = {
	writeToHead: false,
	setStatus: true,
	setHeader: true
}

const apiMiddleware = () => (req, res, next) => {
	if (!req._using) req._using = {}
	
	req._using.api = '1.0.0'
	
	req.apiResult = (status, data, _options) => {
		const options = {
			...defaultOptions,
			..._options
		}
		
		if (!options.forceSend && res.headersSent) return
		
		const success = status == 200
		const message = data?.message
		
		if (message) data.message = undefined
		
		const draft = {
			success,
			data: success ? data : undefined,
			message: message ? (
				// if resulting message is a thrown error, convert it to a string
				(typeof(message) === 'string') ? message : message.toString()
			) : statusMessage[status] // if no message, give a status message
		}
		
		if (options.setStatus === true) res.status(status || 200)
		if (options.setHeader) res.set('Content-Type', 'application/json')
		
		setTimeout(() => {
			res.write(JSON.stringify(draft))
			res.end()
		}, 1000)
	}
	
	next()
}

export default apiMiddleware