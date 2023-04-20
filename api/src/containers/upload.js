import { Router } from 'express'
import multer from 'multer'
import fs from 'fs'
import path from 'path'

import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

import Media from '../models/Media.js'

import useFields from '../util/useFields.js'
import CDN from '../services/cdn.js'
import config from '../../config.js'

const upload = multer({
	storage: multer.memoryStorage()
})

const cdn = new CDN(config.cdn)

export default server => {
	const router = new Router()
	
	const img = fs.createReadStream(path.resolve(__dirname, './testimg.jpg'))
	
	const testUpload = cdn.uploadFile('test.png', img)
		.then(res => {
			//console.log('UPLOAD RES', res)
		})
	
	router.post(
		'/upload',
		server.oauth.authorize(),
		useFields(),
		async (req) => {
			
		}
	)
	
	return router
}