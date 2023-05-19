import busboy from 'busboy'

import {
	createMedia,
	getMedia,
	deleteMedia,
	allowedMediaTypes
} from '../services/uploadService.js'

const MAX_FILE_SIZE = 20 * 1000000 // 20MB

export default {
	uploadMedia: async (req, res) => {
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
	},
	
	getMedia: async (req) => {
		try {
			const res = await getMedia(req.params.mediaId)
			
			req.apiResult(200, res)
		} catch(error) {
			req.apiResult(401, {
				message: error
			})
		}
	},
	
	deleteMedia: async (req) => {
		try {
			const res = await deleteMedia(req.params.mediaId)
			
			req.apiResult(200, res)
		} catch(error) {
			req.apiResult(401, {
				message: error
			})
		}
	}
}