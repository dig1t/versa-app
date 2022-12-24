import mongoose from 'mongoose'
//import sanitize from 'mongo-sanitize'
import crypto from 'crypto'

import { validateText } from '../util'

import Post from '../models/Post'

const createPost = (userId, query) => new Promise(async (resolve, reject) => {
	const { text } = query
	
	if (text.length > 50 || !validateText(text, 'text')) {
		reject('Text is too long, max characters is 50')
	} else {
		const postId = crypto.randomBytes(12).toString('hex')
		const post = new Post({
			_id: postId,
			userId,
			text
		})
		
		post.save()
			.then(() => {
				resolve({
					post: {
						postId,
						userId,
						created: post.created
					},
					message: 'Post has been created'
				})
			})
			.catch(e => reject(e))
	}
})

export {
	createPost
}