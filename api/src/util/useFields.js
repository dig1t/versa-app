export default options => (req, res, next) => {
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