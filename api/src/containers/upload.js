import { Router } from 'express'
import multer from 'multer'
import fs from 'fs'
import path from 'path'

import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

import Media from '../models/Media.js'

import { mongoSanitize, mongoValidate } from '../util/index.js'
import useFields from '../util/useFields.js'
import CDN from '../services/cdn.js'
import config from '../../config.js'

const MAX_FILE_SIZE_MB = 20
const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
const ALLOWED_VIDEO_TYPES = ['video/mp4', 'video/quicktime']
const ALLOWED_AUDIO_TYPES = ['audio/mpeg', 'audio/wav']

const acceptedTypes = [
	...ALLOWED_IMAGE_TYPES,
	...ALLOWED_VIDEO_TYPES,
	...ALLOWED_AUDIO_TYPES,
]

const upload = multer({
	storage: multer.memoryStorage()
})

const cdn = new CDN(config.cdn)

const deserializeMedia = (media) => ({
	mediaId: media.mediaId,
	isContentNSFW: media.isContentNSFW,
	isContentSensitive: media.isContentSensitive,
	isContentViolent: media.isContentViolent,
	// TODO: finish media deserialization
})

const getMedia = async (mediaId) => {
	const media = await Media.findOne({ _id: mongoSanitize(mediaId) })
	
	if (!media) throw new Error('Media does not exist')
	
	return deserializeMedia(media)
}

const getMediaFromHash = async (hash) => {
	const media = await Media.findOne({ md5Hash: mongoSanitize(hash) })
	
	if (!media) false
	
	return deserializeMedia(media)
}

const createMedia = async (options) => {
	if (typeof options !== 'object') throw new Error('Missing media options')
	if (options.userId === undefined) throw new Error('Missing userId')
	if (options.file === undefined) throw new Error('Missing file')
	
	if (!mongoValidate(options.userId, 'id')) {
		throw new Error(`Invalid userId`)
	}
	
	const fileExtension = path.extname(options.file.path)
	
	if (typeof fileExtension !== 'string') {
		throw new Error('File does not have an extension')
	}
	
	// Use a hash to avoid duplicates
	const hash = await cdn.getFileHash(options.file)
	const mediaResult = await getMediaFromHash(hash)
	
	if (mediaExists !== false) {
		return mediaResult
	}
	
	const mediaId = new mongoose.Types.ObjectId()
	
	const { publicUrl } = await cdn.uploadFile({
		mediaId,
		extension: fileExtension,
		buffer: options.file.buffer,
		mime: options.file.mimetype
	})
	
	const media = new Media({
		mediaId,
		userId: mongoSanitize(options.userId),
		md5Hash: mongoSanitize(hash),
		//TODO: mime: ???,
		cdn: 0,
		isContentNSFW: options.isContentNSFW,
		isContentSensitive: options.isContentSensitive,
		isContentViolent: options.isContentViolent
	})
	
	try {
		await media.save()
		
		return {
			...deserializeMedia(media),
			publicUrl,
			uploaded: true
		}
	} catch(error) {
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
	
	//const img = fs.createReadStream(path.resolve(__dirname, './testimg.jpg'))
	
	/*const testUpload = cdn.uploadFile('test.png', img)
		.then((res) => {
			//console.log('UPLOAD RES', res)
		})*/
	
	router.post(
		'/media/upload',
		server.oauth.authorize(),
		upload.single('file'),
		async (req) => {
			if (req.params?.mediaId === undefined) {
				return req.apiResult(500, {
					message: 'Missing mediaId'
				})
			}
			
			if (req.file === undefined) {
				return req.apiResult(500, {
					message: 'Missing file'
				})
			}
			
			if (!acceptedTypes.includes(req.file.mimetype)) {
				return req.apiResult(500, {
					message: 'File type is not allowed'
				})
			}
			
			if (req.file.size / Math.pow(1024, 2) > MAX_FILE_SIZE_MB) {
				return req.apiResult(500, {
					message: 'File is too large'
				})
			}
			
			try {
				const res = await createMedia({
					userId: req._oauth.user.userId,
					file: req.file // Pass file from multer
				})
				
				req.apiResult(200, res)
			} catch(error) {
				req.apiResult(401, {
					message: error
				})
			}
		}
	)
	
	router.get(
		'/media/:mediaId',
		server.oauth.authorize(),
		async (req) => {
			if (req.params?.mediaId === undefined) {
				return req.apiResult(500, {
					message: 'Missing mediaId'
				})
			}
			
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
		server.oauth.authorize(),
		async (req) => {
			if (req.params?.mediaId === undefined) {
				return req.apiResult(500, {
					message: 'Missing mediaId'
				})
			}
			
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