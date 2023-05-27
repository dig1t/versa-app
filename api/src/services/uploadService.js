import mongoose from 'mongoose'
import path from 'path'

import Media from '../models/Media.js'

import { ObjectIdToString, mongoSanitize, mongoValidate } from '../util/mongoHelpers.js'
import validateText from '../util/validateText.js'
import CDN from '../util/cdn.js'
import config from '../../config.js'

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

const deserializeMedia = (media) => {
	const extension = media.ext || media.extension
	
	return {
		mediaId: ObjectIdToString(media.mediaId),
		type: getMediaTypeName(media.type),
		userId: ObjectIdToString(media.userId),
		mimeType: media.mime,
		extension,
		md5: media.md5Hash,
		cdn: media.cdn,
		isMediaNSFW: media.isMediaNSFW,
		isMediaSensitive: media.isMediaSensitive,
		isMediaViolent: media.isMediaViolent,
		source: media.source || `https://cdn.versaapp.co/${media.mediaId}${extension && '.' + extension}`,
		created: media.created
	}
}

const getMedia = async (mediaId) => {
	const media = await Media.findOne({ _id: mongoSanitize(mediaId) })
	
	if (!media) throw new Error('Media does not exist')
	
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
		// TODO: not needed?
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
			ext: fileExtension.charAt(0) === '.' ? fileExtension.slice(1) : fileExtension,
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
	deleteMedia,
	allowedMediaTypes,
	deserializeMedia
}