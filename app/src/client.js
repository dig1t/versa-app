import React from 'react'
import { hydrateRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { createBrowserHistory } from 'history'

import App from './components/App'

const history = createBrowserHistory()

hydrateRoot(
	document,
	<React.StrictMode>
		<BrowserRouter history={history}>
			<App assets={window.assetManifest} />
		</BrowserRouter>
	</React.StrictMode>
)