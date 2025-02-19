import React from 'react'
import { Routes, Route } from 'react-router-dom'

import PrivateRoute from './PrivateRoute.js'

const Error = React.lazy(() => import('./ErrorRoute.js'))
const Landing = React.lazy(() => import('./LandingRoute.js'))
const Login = React.lazy(() => import('../../Auth/components/LoginRoute.js'))
const Signup = React.lazy(() => import('../../Auth/components/SignupRoute.js'))
const Logout = React.lazy(() => import('../../Auth/components/LogoutRoute.js'))
const Settings = React.lazy(() => import('../../Settings/components/SettingsRoute.js'))
const Home = React.lazy(() => import('./HomeRoute.js'))
const Profile = React.lazy(() => import('../../User/components/ProfileRoute.js'))
const Content = React.lazy(() => import('../../Content/components/ContentRoute.js'))
const Chat = React.lazy(() => import('../../Chat/components/ChatRoute.js'))

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
		<Route path="/chat" element={<Chat />} />
	</Route>

	<Route path="/:username" element={<Profile />} />
	<Route path="/:username/:contentId" element={<Content />} />

	<Route path="/error" element={<Error />} />
	<Route path="*" element={<Error />} />
</Routes>

export default AppRoutes
