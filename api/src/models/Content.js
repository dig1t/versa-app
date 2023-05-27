import mongoose, { Schema } from 'mongoose'

import config from '../constants/config.js'
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
	
	media: [
		{
			type: Schema.Types.ObjectId,
			ref: 'Media'
		}
	],
	
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

schema.path('media').validate(function(media) {
	return media.length <= config.post.maxMediaCount
}, `Exceeded the maximum number of media items (${config.post.maxMediaCount})`)

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

schema.index({ contentId: 1 })
schema.index({ userId: 1 })
schema.index({ mediaId: 1 })
schema.index({ created: -1 })

export default mongoose.models.Content || mongoose.model('Content', schema)