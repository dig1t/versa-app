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
		default: new Date().toISOString(),
		required: true
	},
	
	type: {
		type: Schema.Types.Number,
		maxlength: 1,
		default: 1
		/* {
			1: 'content',
			2: 'collab' (someone added you as a collaborator)
		} */
	}
}, { _id: false })

export default mongoose.model('Post', schema)