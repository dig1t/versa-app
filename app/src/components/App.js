import React, { Suspense } from 'react'
import { Provider } from 'react-redux'

import { createStore } from '../store.js'

import AppRoutes from './Routes.js'
import Html from './Html.js'

import { FetchInitialData } from '../containers/FetchInitialData.js'
import { HydrationProvider } from '../context/Hydration.js'
import Loading from './Loading.js'

import '../assets/styles/main.scss'

const store = createStore()

const App = ({ assets, title }) => <HydrationProvider>
	<Html assets={assets} title={title}>
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