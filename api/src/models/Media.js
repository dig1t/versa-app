import mongoose, { Schema } from 'mongoose'

// cdn.versaapp.co/${mediaId}.${extension}

const schema = new Schema({
	_id: {
		type: Schema.Types.ObjectId,
		alias: 'mediaId'
	},
	type: {
		type: Number,
		maxlength: 1,
		required: true
	},
	userId: {
		type: Schema.Types.ObjectId,
		ref: 'User',
		required: true
	},
	md5Hash: {
		type: String,
		maxlength: 32,
		required: true
	},
	mime: {
		type: String,
		required: true
	},
	ext: {
		type: String,
		maxlength: 16
	},
	cdn: {
		type: Number,
		required: true,
		default: 0
	},
	isMediaNSFW: Boolean,
	isMediaSensitive: Boolean,
	isMediaViolent: Boolean,
	created: {
		type: Date,
		maxlength: 27,
		default: Date.now,
		required: true
	}
}, { _id: false })

schema.index({ mediaId: 1 })
schema.index({ userId: 1 })
schema.index({ created: -1 })

export default mongoose.models.Media || mongoose.model('Media', schema)