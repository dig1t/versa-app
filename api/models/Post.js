import mongoose, { Schema } from 'mongoose'

const postSchema = new Schema({
	_id: {
		type: Schema.Types.ObjectId,
		alias: 'postId'
	},
	userId: {
		type: Schema.Types.ObjectId,
		ref: 'User',
		required: true
	},
	embedId: String,
	repliedPostId: {
		type: Schema.Types.ObjectId,
		ref: 'Post'
	},
	text: {
		type: String,
		maxlength: 50
	},
	reposts: {
		type: Number,
		default: 0
	},
	created: {
		type: Date,
		default: Date.now()
	}
}, { _id: false })

export default mongoose.model('Post', postSchema)