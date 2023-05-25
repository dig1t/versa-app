import mongoose, { Schema } from 'mongoose'

const schema = new Schema({
	_id: {
		type: Schema.Types.ObjectId,
		alias: 'sessionId'
	},
	expires: {
		type: Date,
		required: true
	},
	isDeleted: {
		type: String,
		default: false
	}
}, {
	_id: false
})

schema.index({ sessionId: 1 })
schema.index({ expires: 1209600 })

export default mongoose.models.Session || mongoose.model('Session', schema)