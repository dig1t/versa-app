import mongoose, { Schema } from 'mongoose'

const schema = new Schema({
	_id: {
		type: Schema.Types.ObjectId,
		alias: 'likeId'
	},
	userId: {
		type: Schema.Types.ObjectId,
		ref: 'User',
		required: true
	},
	contentId: {
		type: Schema.Types.ObjectId,
		ref: 'Content',
		required: true
	},
	created: {
		type: Date,
		maxlength: 27,
		default: Date.now,
		required: true
	}
}, { _id: false })

schema.index({ userId: 1, contentId: 1 })
schema.index({ created: -1 })

export default mongoose.models.Like || mongoose.model('Like', schema)
