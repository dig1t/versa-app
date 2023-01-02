import React, { useEffect } from 'react'
import { Provider, useDispatch } from 'react-redux'

import { createStore } from '../store'

import AppRoutes from './Routes'
import Html from './Html'

import { AuthContextProvider } from '../context/Auth'
import { fetchUserAuth } from '../actions/user'

const store = createStore()

const FetchInitialData = ({ children, props }) => {
	const dispatch = useDispatch()
	
	useEffect(() => dispatch(fetchUserAuth()), [])
	
	return <React.Fragment { ...props }>{ children }</React.Fragment>
}

const App = props => <Html assets={props.assets} title={props.title}>
	<Provider store={store}>
		<FetchInitialData>
			<AppRoutes />
		</FetchInitialData>
	</Provider>
</Html>

export default App