import { Router } from 'express'

import users from './userRoutes.js'
import profiles from './profileRoutes.js'
import content from './contentRoutes.js'
import follows from './followRoutes.js'
import settings from './settingRoutes.js'
import feed from './feedRoutes.js'
import upload from './uploadRoutes.js'

const useRoutes = (server) => {
	const router = new Router()
	
	router.get('/ping', (_req, res) => res.json({ pong: true }))
	
	router.use(users(server))
	router.use(profiles(server))
	router.use(content(server))
	router.use(follows(server))
	router.use(settings(server))
	router.use(feed(server))
	router.use(upload(server))
	
	return router
}

export default useRoutes