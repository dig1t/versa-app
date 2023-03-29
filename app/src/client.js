import React from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { createBrowserHistory } from 'history'

import App from './components/App.js'

const history = createBrowserHistory()
const container = document.getElementById('root')

const root = createRoot(container)

root.render(
	<React.StrictMode>
		<BrowserRouter history={history}>
			<App assets={window.assetManifest} />
		</BrowserRouter>
	</React.StrictMode>
)