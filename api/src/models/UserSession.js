import mongoose, { Schema } from 'mongoose'

const schema = new Schema({
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

schema.index({ sessionId: 1 })
schema.index({ userId: 1 })
schema.index({ timestamp: -1 })
schema.index({ isDeleted: 1 })

export default mongoose.models.UserSession || mongoose.model('UserSession', schema)