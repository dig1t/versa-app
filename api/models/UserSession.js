import mongoose, { Schema } from 'mongoose'

const userSessionSchema = new mongoose.Schema({
	_id: {
		type: Schema.Types.ObjectId,
		alias: 'sessionId'
	},
	userId: {
		type: Schema.Types.ObjectId,
		ref: 'User',
		required: true
	},
	userAgent: String,
	ip: String,
	timestamp: {
		type: Date,
		default: Date.now()
	},
	isDeleted: {
		type: Boolean,
		default: false
	}
}, { _id: false })

userSessionSchema.methods.method = (a, b) => {
	return true
}

export default mongoose.model('UserSession', userSessionSchema)