import React from 'react'
import { createRoot } from 'react-dom/client'
import {  } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { createBrowserHistory } from 'history'

import App from './components/App.js'

const history = createBrowserHistory()
const root = createRoot(document)

root.render(
	<React.StrictMode>
		<BrowserRouter history={history}>
			<App assets={window.assetManifest} />
		</BrowserRouter>
	</React.StrictMode>
)