import mongoose, { Schema } from 'mongoose'

const schema = new Schema({
	_id: {
		type: Schema.Types.ObjectId,
		alias: 'mediaId'
	},
	type: {
		type: Number,
		maxlength: 1,
		required: true
		/* {
			1: 'image',
			2: 'video',
			3: 'live',
			4: 'audio'
		} */
	},
	userId: {
		type: Schema.Types.ObjectId,
		ref: 'User',
		required: true
	},
	cdn: {
		type: String,
		required: true
	},
	sourceId: {
		type: Schema.Types.ObjectId,
		required: true
	},
	created: {
		type: Date,
		maxlength: 27,
		default: Date.now,
		required: true
	}
}, { _id: false })

export default mongoose.models.Media || mongoose.model('Media', schema)