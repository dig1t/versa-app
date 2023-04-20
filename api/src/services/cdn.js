import {
	S3Client,
	//ListBucketsCommand,
	//ListObjectsV2Command,
	//GetObjectCommand,
	PutObjectCommand
} from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import axios from 'axios'

import Media from '../models/Media.js'
import cdnConfig from '../../config/cdn.js'

const createMedia = (userId, )

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
	
	async uploadFile(mediaId, file) {
		const s3Key = fileName
		const path = file.path ? `${file.path}/` : ''
		
		try {
			const s3PutUrl = await getSignedUrl(
				this.s3Client,
				new PutObjectCommand({
					Bucket: this.bucketName,
					Key: `${path}${s3Key}`,
					//ContentType: 'application/octet-stream'
				}), { expiresIn: 3600 }
			)
			
			const response = await axios.put(
				s3PutUrl,
				file.stream || Buffer.from(file.buffer, 'binary'),
				{ headers: {
					'Content-Type': file.mime
				} }
			)
			
			if (response.status !== 200) {
				throw new Error(`Failed to upload file ${fileName}`)
			}
			
			return {
				publicUrl: `https://cdn.versaapp.co/${path}${s3Key}`
			}
		} catch(error) {
			console.log(error, 'error')
		}
	}
	
	async deleteFile(fileName) {
		const s3Bucket = `r2.shared-${this.zoneId}`
		const s3Key = fileName
		
		const response = await this.s3Client.send(
			new DeleteObjectCommand({ Bucket: s3Bucket, Key: s3Key })
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