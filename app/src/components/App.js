import React from 'react'
import { Provider } from 'react-redux'

import { createStore } from '../store'

import AppRoutes from './Routes'
import Html from './Html'

import { FetchInitialData } from '../containers/FetchInitialData'
import { HydrationProvider } from '../context/Hydration'

const store = createStore()

const App = props => <HydrationProvider>
	<Html assets={props.assets} title={props.title}>
		<Provider store={store}>
			<FetchInitialData>
				<AppRoutes />
			</FetchInitialData>
		</Provider>
	</Html>
</HydrationProvider>

export default App