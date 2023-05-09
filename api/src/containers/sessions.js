import { Router } from 'express'
import mongoose from 'mongoose'
import path from 'path'

import Session from '../models/Session.js'

import { mongoSanitize, mongoValidate, validateText } from '../util/index.js'
import useFields from '../util/useFields.js'

const sessionConfig = {
	ttl: 1209600
}

const createMedia = async (options) => {
	if (typeof options !== 'object') throw new Error('Missing media options')
	if (options.userId === undefined) throw new Error('Missing userId')
	if (options.fileStream === undefined) throw new Error('Missing file stream')
	if (options.metadata === undefined) throw new Error('Missing file metadata')
	
	if (!mongoValidate(options.userId, 'id')) {
		throw new Error(`Invalid userId`)
	}
	
	const fileExtension = path.extname(options.metadata.filename)
	
	if (typeof fileExtension !== 'string') {
		throw new Error('File does not have an extension')
	}
	
	if (!validateText(options.metadata.mimeType, 'mime-type')) {
		throw new Error('Mime type is not valid')
	}
	
	const sessionId = new mongoose.Types.ObjectId()
	
	try {
		const promises = [
			cdn.uploadFile({
				mediaId,
				extension: fileExtension,
				fileStream: options.fileStream,
				fileName: options.metadata.filename,
				mimeType: options.metadata.mimeType,
				onUploadProgress: (progress) => options.onUploadProgress(progress)
			}),
			cdn.getFileHash(options.fileStream)
		]
		
		const res = await Promise.allSettled(promises)
		
		const { publicUrl, md5Hash } = res.reduce((result, promise) => ({
			...result,
			...promise.value
		}), {})
		
		const media = new Media({
			mediaId,
			userId: mongoSanitize(options.userId),
			md5Hash: mongoSanitize(md5Hash),
			mime: mongoSanitize(options.metadata.mimeType),
			type: mediaType,
			cdn: 0,
			isMediaNSFW: options.isMediaNSFW || false,
			isMediaSensitive: options.isMediaSensitive || false,
			isMediaViolent: options.isMediaViolent || false
		})
		
		await media.save()
		
		return new Promise((resolve) => resolve({
			...deserializeMedia(media),
			publicUrl,
			uploaded: true
		}))
	} catch(error) {
		console.log(error)
		throw new Error('Could not upload file')
	}
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