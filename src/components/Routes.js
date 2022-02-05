import React from 'react'
import { Route, Routes } from 'react-router-dom'

//import PrivateRoute from './PrivateRoute'

import Error from './Routes/Error'
import Landing from './Routes/Landing'

//<PrivateRoute exact path="/my/settings" component={UserSettings} requireAuth={true} redirect="/login" />
//<PrivateRoute exact path="/login" component={Login} requireNoAuth={true} redirect="/" />
//<PrivateRoute exact path="/me" component={UserProfile} requireAuth={true} redirect="/login" />

export default () => (
	<Routes>
		<Route exact path="/" element={Landing} />
		
		<Route path="*" element={<Error />} />
	</Routes>
)