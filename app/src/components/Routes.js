import React from 'react'
import { Route, Routes } from 'react-router-dom'

import PrivateRoute from './PrivateRoute'

import Error from './Routes/Error'
import Landing from './Routes/Landing'
import Home from './Routes/Home'
import Login from './Routes/Login'
import Signup from './Routes/Signup'

//<PrivateRoute exact path="/my/settings" component={UserSettings} requireAuth={true} redirect="/login" />
//<PrivateRoute exact path="/login" component={Login} requireNoAuth={true} redirect="/" />
//<PrivateRoute exact path="/me" component={UserProfile} requireAuth={true} redirect="/login" />

const AppRoutes = () => <Routes>
	<Route path="/" element={
		<PrivateRoute requireNoAuth={true} redirectTo="/home">
			<Landing />
		</PrivateRoute>
	} />
	
	<Route path="/logout" element={
		<PrivateRoute requireAuth={true} redirectTo="/" />
	} />
	
	<Route path="/login" element={
		<PrivateRoute requireNoAuth={true} redirectTo="/">
			<Login />
		</PrivateRoute>
	} />
	
	<Route path="/signup" element={
		<PrivateRoute requireNoAuth={true} redirectTo="/">
			<Signup />
		</PrivateRoute>
	} />
	
	<Route path="/home" element={
		<PrivateRoute requireAuth={true} redirectTo="/login">
			<Home />
		</PrivateRoute>
	} />
	
	<Route path="*" element={<Error />} />
</Routes>

export default AppRoutes