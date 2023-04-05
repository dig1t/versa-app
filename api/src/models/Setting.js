import mongoose, { Schema } from 'mongoose'

const schema = new Schema({
	_id: {
		type: Schema.Types.ObjectId,
		alias: 'settingId'
	},
	userId: {
		type: Schema.Types.ObjectId,
		ref: 'User',
		required: true
	},
	appTheme: {
		/* {
			1: 'light',
			2: 'dark'
		} */
		type: Number,
		default: 1,
		maxlength: 2
	},
}, { _id: false })

export default mongoose.models.Setting || mongoose.model('Setting', schema)