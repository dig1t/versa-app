import mongoose, { Schema } from 'mongoose'

const schema = new Schema({
	_id: {
		type: Schema.Types.ObjectId,
		alias: 'commentId'
	},
	contentId: {
		type: Schema.Types.ObjectId,
		ref: 'Content'
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
	}
}, { _id: false })

export default mongoose.models.Comment || mongoose.model('Comment', schema)