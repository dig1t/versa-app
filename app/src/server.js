import React from 'react'
import { renderToPipeableStream } from 'react-dom/server'
import { StaticRouter } from 'react-router-dom/server'

import App from './components/App'

const assets = {
	bundle: '/assets/js/bundle.js',
	css: '/assets/css/build.min.css'
}

const ServerSideRender = (req, res) => {
	req.app.get('env') === 'development' && res.setHeader('Cache-Control', 'no-cache')
	res.setHeader('Content-Type', 'text/html; charset=utf-8')
	
	let didError = false
	
	const { pipe, abort } = renderToPipeableStream(
		<React.StrictMode>
			<StaticRouter location={req.url}>
				<App assets={assets} />
			</StaticRouter>
		</React.StrictMode>,
		{
			bootstrapScripts: [ assets.bundle ],
			onShellReady() {
				// The content above all Suspense boundaries is ready.
				// If something errored before we started streaming, we set the error code appropriately.
				res.statusCode = didError ? 500 : 200
				pipe(res)
			},
			onShellError() {
				// Something errored before we could complete the shell so we emit an alternative shell.
				console.log('shell err')
				
				res.statusCode = 500
				res.render('template', {
					assets: JSON.stringify(assets),
					bundle: assets.bundle
				})
			},
			onError(err) {
				console.log('on err')
				didError = true
				console.error(err)
			},
		}
	)
}

export default ServerSideRender