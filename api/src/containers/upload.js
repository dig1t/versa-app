import { Router } from 'express'
import mongoose from 'mongoose'
import path from 'path'
import busboy from 'busboy'

import Media from '../models/Media.js'

import { mongoSanitize, mongoValidate, validateText } from '../util/index.js'
import useFields from '../util/useFields.js'
import CDN from '../services/cdn.js'
import config from '../../config.js'

const MAX_FILE_SIZE = 20 * 1000000 // 20MB

const mediaTypes = {
	image: {
		allowedTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/gif'],
		typeId: 0
	},
	video: {
		allowedTypes: ['video/mp4', 'video/quicktime'],
		typeId: 1
	},
	live: {
		allowedTypes: [],
		typeId: 2
	},
	audio: {
		allowedTypes: ['audio/mpeg', 'audio/wav'],
		typeId: 3
	}
}

const allowedMediaTypes = Object.values(mediaTypes)
	.map(({ allowedTypes }) => allowedTypes)
	.flat()

const getMediaType = (fileType) => {
	for (const [mediaType, config] of Object.entries(mediaTypes)) {
		if (config.allowedTypes.includes(fileType)) {
			return config.typeId
		}
	}
	return null
}

const getMediaTypeName = (typeId) => {
	for (const [mediaType, config] of Object.entries(mediaTypes)) {
		if (config.typeId === typeId) {
			return mediaType
		}
	}
	return null
}

const cdn = new CDN(config.cdn)

const deserializeMedia = (media) => ({
	mediaId: media.mediaId.toHexString(),
	type: getMediaTypeName(media.type),
	userId: media.userId.toHexString(),
	mimeType: media.mime,
	md5: media.md5Hash,
	cdn: media.cdn,
	isMediaNSFW: media.isMediaNSFW,
	isMediaSensitive: media.isMediaSensitive,
	isMediaViolent: media.isMediaViolent,
	created: media.created
})

const getMedia = async (mediaId) => {
	const media = await Media.findOne({ _id: mongoSanitize(mediaId) })
	
	if (!media) throw new Error('Media does not exist')
	
	return deserializeMedia(media)
}

const getMediaFromHash = async (hash) => {
	const media = await Media.findOne({ md5Hash: mongoSanitize(hash) })
	
	if (!media) return false
	
	return deserializeMedia(media)
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
	
	const mediaType = getMediaType(options.metadata.mimeType)
	
	const mediaId = new mongoose.Types.ObjectId()
	
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

const deleteMedia = async (userId, mediaId) => {
	const media = await getMedia(mediaId)
	
	if (media.userId !== userId) {
		throw new Error('Not authorized to delete media')
	}
	
	try {
		await Media.deleteOne({ _id: media.mediaId })
		
		return { deleted: true }
	} catch(error) {
		throw new Error('Could not delete media')
	}
}

export {
	createMedia,
	getMedia,
	deleteMedia
}

export default (server) => {
	const router = new Router()
	
	router.post(
		'/media/upload',
		server.oauth.authorize(),
		async (req, res) => {
			if (!req.is('multipart/form-data')) {
				return req.apiResult(500, {
					message: 'Request must be multipart/form-data'
				})
			}
			
			try {
				const bb = busboy({
					headers: req.headers,
					limits: {
						fileSize: MAX_FILE_SIZE
					}
				})
				let mediaPromise
				
				bb.on('file', (name, fileStream, metadata) => {
					if (!allowedMediaTypes.includes(metadata.mimeType)) {
						return req.apiResult(500, {
							message: 'File type is not allowed'
						})
					}
					
					res.set('Content-Type', 'application/json')
					
					mediaPromise = createMedia({
						fileStream,
						metadata, // { filename, encoding, mimeType }
						userId: req._oauth.user.userId,
						onUploadProgress: (progressEvent) => {
							const progress = Math.round(
								(progressEvent.loaded / progressEvent.total) * 100
							)
							
							console.log('PROGRESS', progress)
							res.write(JSON.stringify({ progress }))
							res.flush()
						}
					})
				})
				
				bb.on('close', () => {
					const apiResultOptions = {
						forceSend: true,
						setStatus: false,
						setHeader: false
					}
					
					mediaPromise
						.then((mediaData) => req.apiResult(
							mediaData ? 200 : 401,
							mediaData,
							apiResultOptions
						))
						.catch((error) => req.apiResult(401, {
							message: error
						}, apiResultOptions))
				})
				
				req.pipe(bb)
			} catch(error) {
				console.log(error)
				req.apiResult(401, {
					message: error
				})
			}
		}
	)
	
	router.get(
		'/media/:mediaId',
		useFields({ params: ['mediaId'] }),
		server.oauth.authorize(),
		async (req) => {
			try {
				const res = await getMedia(req.params.mediaId)
				
				req.apiResult(200, res)
			} catch(error) {
				req.apiResult(401, {
					message: error
				})
			}
		}
	)
	
	router.delete(
		'/media/:mediaId',
		useFields({ params: ['mediaId'] }),
		server.oauth.authorize(),
		async (req) => {
			try {
				const res = await deleteMedia(req.params.mediaId)
				
				req.apiResult(200, res)
			} catch(error) {
				req.apiResult(401, {
					message: error
				})
			}
		}
	)
	
	return router
}