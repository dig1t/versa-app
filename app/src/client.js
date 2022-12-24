import React from 'react'
import { hydrateRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import { BrowserRouter } from 'react-router-dom'
import { createBrowserHistory } from 'history'

import { createStore } from './store'

import App from './components/App'

const history = createBrowserHistory()
const store = createStore(window.__PRELOADED_STATE__)

hydrateRoot(
	document,
	<React.StrictMode>
		<Provider store={store} serverState={window.__PRELOADED_STATE__}>
			<BrowserRouter history={history}>
				<App assets={window.assetManifest} />
			</BrowserRouter>
		</Provider>
	</React.StrictMode>
)