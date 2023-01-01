// https://github.com/drinking-code/react-fast-refresh-renderToPipeableStream/blob/master/render.js

const path = require('path')

const ServerSideRender = '../src/server'

async function render(req, res) {
	try {
		if (process.env.NODE_ENV === 'development') {
			for (const modulePath in require.cache) {
				if (modulePath.startsWith(path.join(__dirname, '/../src/'))) delete require.cache[modulePath]
			}
		}
		
		await require(ServerSideRender)?.default(req, res)
	} catch (err) {
		console.error(err);
		res.send('Internal Error')
	}
}

module.exports = render