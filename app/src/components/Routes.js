import React from 'react'
import { Routes, Route } from 'react-router-dom'

import PrivateRoute from './PrivateRoute.js'

const Error = React.lazy(() => import('./Routes/Error'))
const Landing = React.lazy(() => import('./Routes/Landing'))
const Home = React.lazy(() => import('./Routes/Home'))
const Login = React.lazy(() => import('./Routes/Login'))
const Signup = React.lazy(() => import('./Routes/Signup'))
const Logout = React.lazy(() => import('./Routes/Logout'))
const Profile = React.lazy(() => import('./Routes/Profile'))

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
	
	<Route path="/:usernameParam" element={<Profile />} />
	
	<Route path="/error" element={<Error />} />
	<Route path="*" element={<Error />} />
</Routes>

export default AppRoutes