import mongoose, { Schema } from 'mongoose'

const schema = new Schema({
	_id: {
		type: Schema.Types.ObjectId,
		alias: 'conversationId'
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

export default mongoose.models.Conversation || mongoose.model('Conversation', schema)
