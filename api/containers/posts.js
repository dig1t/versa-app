import mongoose from 'mongoose'

import { validateText } from '../util'

import Post from '../models/Post'
import Content from '../models/Content'
import config from '../constants/config'

// Post data structure
// when pulled from api
/* const post = {
	...postData
	content: {
		...data
		media: {}, // Media pulled from database
	},
	collaborators: {}, // Pull all userIds matching from collab modal
} */

// const propsExist = (props, keys) => {
// 	keys.map(key => {
// 		if (!props[key]) throw new error(`${key} missing`)
// 	})
// }

const createContent = async data => {
	if (!data.userId) throw new Error('Missing userId')
	
	if (body.length > config.post.maxBodyLength || !validateText(body, 'text')) {
		throw `Content body is too long, max characters is ${config.post.maxBodyLength}`
	}
	
	const contentId = new mongoose.Types.ObjectId()
	const content = new Content({
		contentId,
		userId,
		body
	})
	
	try {
		await content.save()
		
		return {
			contentId,
			userId,
			body,
			created: content.created
		}
	} catch(e) {
		throw 'Could not create content'
	}
}

const serializePost = (post, content) => ({
	...post,
	content
})

/*
{
	post: {
		postId,
		//contentId: content.contentId,
		userId,
		created: post.created
	},
	message: 'Post has been created'
}
*/

const createPost = async (userId, query) => {
	const { body } = query
	
	if (body.length > config.post.maxBodyLength || !validateText(text, 'text')) {
		throw `Content body is too long, max characters is ${config.post.maxBodyLength}`
	}
	
	const content = await createContent({
		userId,
		body: query.body
	})
	
	const postId = new mongoose.Types.ObjectId()
	const post = new Post({
		postId,
		contentId: content.contentId,
		userId
	})
	
	try {
		await post.save()
	} catch(e) {
		throw 'Could not create post'
	}
	
	return serializePost(post, content)
}

export {
	createPost
}