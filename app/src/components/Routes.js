import React from 'react'
import { Routes, Route } from 'react-router-dom'

import PrivateRoute from './PrivateRoute.js'

const Error = React.lazy(() => import('./Routes/Error.js'))
const Landing = React.lazy(() => import('./Routes/Landing.js'))
const Login = React.lazy(() => import('./Routes/Login.js'))
const Signup = React.lazy(() => import('./Routes/Signup.js'))
const Logout = React.lazy(() => import('./Routes/Logout.js'))
const Settings = React.lazy(() => import('./Routes/Settings.js'))
const Home = React.lazy(() => import('./Routes/Home.js'))
const Profile = React.lazy(() => import('./Routes/Profile.js'))
const Content = React.lazy(() => import('./Routes/Content.js'))
const Upload = React.lazy(() => import('./Routes/Upload.js'))

const AppRoutes = () => <Routes>
	<Route element={<PrivateRoute requireNoAuth={true} redirectTo="/home" />}>
		<Route path="/" element={<Landing />} />
		<Route path="/login" element={<Login />} />
		<Route path="/signup" element={<Signup />} />
	</Route>
	
	<Route element={<PrivateRoute requireAuth={true} redirectTo="/login" />}>
		<Route path="/logout" element={<Logout />} />
		<Route path="/settings" element={<Settings />} />
		<Route path="/settings/:categoryParam" element={<Settings />} />
		<Route path="/home" element={<Home />} />
		<Route path="/upload" element={<Upload />} />
	</Route>
	
	<Route path="/:username" element={<Profile />} />
	<Route path="/:username/:contentId" element={<Content />} />
	
	<Route path="/error" element={<Error />} />
	<Route path="*" element={<Error />} />
</Routes>

export default AppRoutes