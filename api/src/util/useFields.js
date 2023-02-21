const defaultOptions = {
	allowObjects: false
}

export default _options => (req, res, next) => {
	const options = {
		...defaultOptions,
		..._options
	}
	
	if (!req._using) req._using = {}
	
	req._using.useFields = '1.0.2'
	
	const data = {
		...req.body,
		...req.query
	}
	
	if (!data) return res.status(400).json({
		success: false,
		message: 'Missing fields'
	})
	
	if (!options.allowObjects) {
		for (let key in data) {
			if (typeof data[key] === 'object') return res.status(400).json({
				success: false,
				message: 'Bad syntax'
			})
		}
	}
	
	if (options.fields) {
		for (let field in options.fields) {
			if (data[options.fields[field]] === undefined)
				return res.status(400).json({
					success: false,
					message: `Missing field: ${options.fields[field]}`
				})
		}
	}
	
	req.fields = data
	
	next()
}