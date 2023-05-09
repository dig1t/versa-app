import { Router } from 'express'

import sessions from './sessions.js'
import users from './users.js'
import profiles from './profiles.js'
import content from './content.js'
import follows from './follows.js'
import settings from './settings.js'
import feed from './feed.js'
import upload from './upload.js'

const Routes = (server) => {
	const router = new Router()
	
	router.get('/ping', (_req, res) => res.json({ pong: true }))
	
	router.use(sessions(server))
	router.use(users(server))
	router.use(profiles(server))
	router.use(content(server))
	router.use(follows(server))
	router.use(settings(server))
	router.use(feed(server))
	router.use(upload(server))
	
	return router
}

export default Routes