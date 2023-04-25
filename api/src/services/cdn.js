import {
	S3Client,
	//ListBucketsCommand,
	//ListObjectsV2Command,
	//GetObjectCommand,
	PutObjectCommand
} from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import axios from 'axios'
import crypto from 'crypto'
import fs from 'fs'

import Media from '../models/Media.js'
import cdnConfig from '../../config/cdn.js'

//const createMedia = (userId, )

class CDN {
	constructor(options) {
		if (typeof options !== 'object') {
			throw new Error('Options are required')
		}
		
		if (options.accessKeyId === undefined) {
			throw new Error('accessKeyId is required')
		}
		
		if (options.accessKeySecret === undefined) {
			throw new Error('accessKeySecret is required')
		}
		
		if (options.bucketName === undefined) {
			throw new Error('bucketName is required')
		}
		
		this.bucketName = options.bucketName
		this.s3Client = new S3Client({
			region: options.region || 'auto',
			endpoint: options.getEndpoint(options.accountId),
			credentials: {
				accessKeyId: options.accessKeyId,
				secretAccessKey: options.accessKeySecret,
			}
		})
	}
	
	async getFileHash(fileStream) {
		const hash = crypto.createHash('md5')
		
		hash.setEncoding('hex')
		
		return new Promise((resolve, reject) => {
			fileStream.on('error', (err) => reject(err))
			fileStream.on('end', () => {
				hash.end()
				resolve(hash.read())
			})
			
			fileStream.pipe(hash)
		})
	}
	
	async uploadFile(options) {
		if (options.fileStream === undefined) {
			throw new Error('fileStream is required')
		}
		
		if (options.fileName === undefined) {
			throw new Error('fileName is required')
		}
		
		if (options.mediaId === undefined) {
			throw new Error('mediaId is required')
		}
		
		if (options.mediaId === undefined) {
			throw new Error('mediaId is required')
		}
		
		if (options.extension === undefined) {
			throw new Error('extension is required')
		}
		
		try {
			const s3PutUrl = await getSignedUrl(
				this.s3Client,
				new PutObjectCommand({
					Bucket: this.bucketName,
					Key: `${options.mediaId}.${options.extension}`
				}),
				{ expiresIn: 3600 }
			)
			
			const response = await axios.put(
				s3PutUrl,
				options.fileStream,
				{ headers: {
					'Content-Type': options.mimeType
				} }
			)
			
			if (response.status !== 200) {
				throw new Error(`Failed to upload file ${options.fileName}`)
			}
			
			return {
				publicUrl: `https://cdn.versaapp.co/${options.mediaId}.${options.extension}`,
			}
		} catch(error) {
			throw new Error('Could not upload file')
		}
	}
	
	async deleteFile(fileName) {
		const s3Bucket = `r2.shared-${this.zoneId}`
		const s3Key = fileName
		
		const response = await this.s3Client.send(
			new DeleteObjectCommand({
				Bucket: s3Bucket,
				Key: s3Key
			})
		)
		
		if (!response.$metadata.httpStatusCode === 204) {
			throw new Error(`Failed to delete file ${fileName}`)
		}
		
		return true
	}
	
	getFileUrl(fileName) {
		const cdnUrl = `https://${this.zoneId}.r2.cfcdn.net/${fileName}`
		return cdnUrl
	}
}

export default CDN