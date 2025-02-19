import { Router } from 'express'
import mongoose from 'mongoose'
import path from 'path'

import Session from '../models/Session.js'

import { mongoSanitize, mongoValidate, validateText } from '../util/index.js'
import useFields from '../util/useFields.js'

const sessionConfig = {
	ttl: 1209600
}

export {

}

export default (server) => {
	const router = new Router()

	router.get(
		'/sessions',
		async (req, res) => {
			try {
				const result = await Session.find({})

				res.json(result)
			} catch(error) {
				res.status(404).send()
			}
		}
	)

	router.delete(
		'/sessions',
		async (req, res) => {
			try {
				await Session.deleteMany({})

				res.json({ status: 'OK' })
			} catch(error) {
				res.status(404).send()
			}
		}
	)

	router.get(
		'/sessions/:sessionId',
		useFields({ params: ['sessionId'] }),
		async (req, res) => {
			try {
				const result = await Session.find({})

				res.json(result)
			} catch(error) {
				res.status(404).send()
			}
		}
	)

	router.delete(
		'/sessions/:sessionId',
		useFields({ params: ['sessionId'] }),
		async (req, res) => {
			try {
				await Session.deleteOne({ _id: req.parmas.sessionId })

				res.json({ status: 'OK' })
			} catch(error) {
				res.status(404).send()
			}
		}
	)

	router.post(
		'/sessions/:sessionId',
		useFields({ params: ['sessionId'] }),
		async (req, res) => {
			if (typeof req.fields.session !== 'string') {
				return res.status(404).send()
			}

			const sessionBody = req.body
			console.log(sessionBody)
			const expires = new Date(sessionBody.expires || (Date.now() + sessionConfig.ttl))
			console.log(expires)
			try {
				const sessionData = {
					_id: mongoSanitize(req.params.sessionId),
					expires,
					session: JSON.stringify(sessionBody || {})
				}

				const session = new Session(sessionData)

				await session.save()

				res.json(sessionData)
			} catch(error) {
				res.status(404).send()
			}
		}
	)

	return router
}
