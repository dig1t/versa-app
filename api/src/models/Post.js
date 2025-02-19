import mongoose, { Schema } from 'mongoose'

const schema = new Schema({
	_id: {
		type: Schema.Types.ObjectId,
		alias: 'postId'
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
	created: {
		type: Date,
		maxlength: 27,
		default: Date.now,
		required: true
	},

	type: {
		type: Number,
		maxlength: 1,
		default: 1 // TODO: switch to 0
		/* {
			0: 'content',
			1: 'collab' (someone added you as a collaborator)
		} */
	}
}, { _id: false })

schema.index({ userId: 1 })
schema.index({ created: -1 })
schema.index({ userId: 1, created: -1 })

export default mongoose.models.Post || mongoose.model('Post', schema)
