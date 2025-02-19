import { Router } from 'express'

import authMiddleware, { logout } from '../middleware/authMiddleware.js'
import apiMiddleware from '../middleware/apiMiddleware.js'
import authController from '../controllers/authController.js'

const router = Router()

router.use(apiMiddleware())
router.use(authMiddleware())

router.post(
	'/auth/logout',
	authController.postLogout
)

router.post(
	'/auth/login',
	logout, // Clear session and cookie data if logged in
	authController.postLogin
)

router.post(
	'/auth/signup',
	authController.postSignup
)

router.get(
	'/auth/get_user',
	authController.getUser
)

export default router
