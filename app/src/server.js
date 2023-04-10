/* eslint-disable no-undef */
import React from 'react'
import { renderToPipeableStream } from 'react-dom/server'
import { StaticRouter } from 'react-router-dom/server'

import App from './components/App.js'

const assets = {
	bundle: '/assets/js/bundle.js',
	css: '/assets/css/build.min.css'
}

const ServerSideRender = (req, res) => {
	process.env.NODE_ENV === 'development' && res.setHeader('Cache-Control', 'no-cache')
	res.setHeader('Content-Type', 'text/html; charset=utf-8')
	
	let didError = false
	
	const { pipe } = renderToPipeableStream(
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
				console.log('shell error')
				
				res.statusCode = 500
				
				res.write(`<!DOCTYPE html><p>Loading...</p><script>assetManifest=${JSON.stringify(assets)};</script><script src="${assets.bundle}"></script>`)
				res.end()
			},
			onError(error) {
				console.log('on error')
				didError = true
				console.error(error)
			},
		}
	)
}

export default ServerSideRender