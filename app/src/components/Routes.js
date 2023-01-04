import React from 'react'
import { Route, Routes } from 'react-router-dom'

import PrivateRoute from './PrivateRoute'

import Error from './Routes/Error'
import Landing from './Routes/Landing'
import Home from './Routes/Home'
import Login from './Routes/Login'
import Signup from './Routes/Signup'
import Logout from './Routes/Logout'

//<PrivateRoute exact path="/my/settings" component={UserSettings} requireAuth={true} redirect="/login" />
//<PrivateRoute exact path="/login" component={Login} requireNoAuth={true} redirect="/" />
//<PrivateRoute exact path="/me" component={UserProfile} requireAuth={true} redirect="/login" />

const AppRoutes = () => <Routes>
	<Route element={<PrivateRoute requireNoAuth={true} redirectTo="/home" />}>
		<Route path="/" element={<Landing />} />
		<Route path="/login" element={<Login />} />
		<Route path="/signup" element={<Signup />} />
	</Route>
	
	<Route element={<PrivateRoute requireAuth={true} redirectTo="/login" />}>
		<Route path="/home" element={<Home />} />
		<Route path="/logout" element={<Logout />} />
	</Route>
	
	
	
	<Route path="*" element={<Error />} />
</Routes>

export default AppRoutes