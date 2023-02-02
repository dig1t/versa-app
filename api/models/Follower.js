import mongoose, { Schema } from 'mongoose'

const schema = new Schema({
	_id: {
		type: Schema.Types.ObjectId,
		alias: 'followId'
	},
	userId: {
		type: Schema.Types.ObjectId,
		ref: 'User',
		required: true
	},
	followUserId: {
		type: Schema.Types.ObjectId,
		ref: 'User',
		required: true
	},
	requested: Schema.Types.Boolean, // If profile is private, this will check true
	created: {
		type: Date,
		maxlength: 27,
		default: new Date().toISOString(),
		required: true
	}
}, { _id: false })

export default mongoose.model('Collaborator', schema)