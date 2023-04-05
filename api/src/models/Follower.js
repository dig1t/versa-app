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
	followerUserId: {
		type: Schema.Types.ObjectId,
		ref: 'User',
		required: true
	},
	requested: Schema.Types.Boolean, // If target profile is private, this will check true
	created: {
		type: Date,
		maxlength: 27,
		default: Date.now,
		required: true
	}
}, { _id: false })

export default mongoose.models.Follower || mongoose.model('Follower', schema)