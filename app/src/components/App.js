import React, { Suspense } from 'react'
import { Provider } from 'react-redux'

import { createStore } from '../store'

import AppRoutes from './Routes'
import Html from './Html'

import { FetchInitialData } from '../containers/FetchInitialData'
import { HydrationProvider } from '../context/Hydration'
import Loading from './Loading'

const store = createStore()

const App = props => <HydrationProvider>
	<Html assets={props.assets} title={props.title}>
		<Provider store={store}>
			<Suspense fallback={<Loading />}>
				<FetchInitialData>
					<AppRoutes />
				</FetchInitialData>
			</Suspense>
		</Provider>
	</Html>
</HydrationProvider>

export default App