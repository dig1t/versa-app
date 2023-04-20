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
		/* {
			0: 'image',
			1: 'video',
			2: 'live',
			3: 'audio'
		} */
	},
	userId: {
		type: Schema.Types.ObjectId,
		ref: 'User',
		required: true
	},
	mime: {
		type: String,
		required: true
	},
	cdn: {
		type: Number,
		required: true,
		default: 0 /* {
			0: 'cloudflare'
		}*/
	},
	nsfw: Boolean,
	created: {
		type: Date,
		maxlength: 27,
		default: Date.now,
		required: true
	}
}, { _id: false })

export default mongoose.models.Media || mongoose.model('Media', schema)