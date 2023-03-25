// https://github.com/drinking-code/react-fast-refresh-renderToPipeableStream/blob/master/render.js

const path = require('path')

async function render(req, res) {
	console.log(__dirname)
	require('../src/server.js').default(req, res)
	/*try {
		if (process.env.NODE_ENV === 'development') {
			for (const modulePath in require.cache) {
				if (modulePath.startsWith('./src') || modulePath.startsWith('./server')) delete require.cache[modulePath]
			}
		}
		
		await require('../src/server.js')?.default(req, res)
	} catch(error) {
		console.error(error)
		res.send('Internal Error')
	} finally {
		// if (process.env.NODE_ENV === 'development') {
		// 	for (const modulePath in require.cache) {
		// 		if (modulePath.startsWith(path.join(__dirname, '/../../src/'))) delete require.cache[modulePath]
		// 	}
		// }
	}*/
}

module.exports = render