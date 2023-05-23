import mongoose, { Schema } from 'mongoose'

import { mongoSession } from '../util/mongoHelpers.js'
import Collaborator from './Collaborator.js'
import Post from './Post.js'
import Comment from './Comment.js'

const schema = new Schema({
	_id: {
		type: Schema.Types.ObjectId,
		alias: 'contentId'
	},
	userId: {
		type: Schema.Types.ObjectId,
		ref: 'User',
		required: true
	},
	
	body: {
		type: String,
		maxlength: 50
	},
	created: {
		type: Date,
		maxlength: 27,
		default: Date.now,
		required: true
	},
	private: Boolean,
	
	mediaId: {
		type: Schema.Types.ObjectId,
		ref: 'Media'
	},
	
	embedId: {
		type: Schema.Types.ObjectId,
		ref: 'Post'
	},
	embedType: {
		type: Number,
		maxlength: 1
		/* {
			1: 'content' // ex: quoting a post
		} */
	},
	
	collaborators: [{
		type: Schema.Types.ObjectId,
		ref: 'Collaborator'
	}],
	
	likes: {
		type: Number,
		default: 0
	},
	comments: {
		type: Number,
		default: 0
	},
	reposts: {
		type: Number,
		default: 0
	}
}, { _id: false })

schema.pre(
	['deleteOne', 'deleteMany'],
	{ document: false, query: true },
	async function(next) {
		const contentId = this._conditions._id
		
		await Collaborator.deleteMany({ contentId })
		await Post.deleteMany({ contentId })
		await Comment.deleteMany({ contentId })
		
		next()
	}
)

export default mongoose.models.Content || mongoose.model('Content', schema)