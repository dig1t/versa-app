import React from 'react'
import ReactDOMServer from 'react-dom/server'
import { StaticRouter } from 'react-router-dom/server'
import { Provider } from 'react-redux'

import Root from './components/Root'

import { setAuthStatus } from './actions/user'
import { configureStore } from './store'

const ServerSideRender = (req, res) => {
	const context = {}
	const store = configureStore()
	
	store.dispatch(setAuthStatus(typeof req.session.userId !== 'undefined'))
	
	let markup = ReactDOMServer.renderToString(
		<StaticRouter location={req.url} context={context}>
			<Provider store={store}>
				<Root />
			</Provider>
		</StaticRouter>
	)
	
	if (context.status) res.status(context.status)
	
	const initialState = store.getState()
	
	return { initialState, markup }
}

export default ServerSideRender