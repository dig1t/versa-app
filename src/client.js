import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import { BrowserRouter } from 'react-router-dom'
import { createBrowserHistory } from 'history'

import { configureStore } from './store'

import Root from './components/Root'

const history = createBrowserHistory()
const store = configureStore(
	typeof window !== 'undefined' && (window.__INITIAL_STATE__ || {})
)

ReactDOM.hydrate(
	<Provider store={store}>
		<BrowserRouter history={history}>
			<Root />
		</BrowserRouter>
	</Provider>,
	document.getElementById('app-root')
)