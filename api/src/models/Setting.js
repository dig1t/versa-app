import mongoose, { Schema } from 'mongoose'

const schema = new Schema({
	_id: {
		type: Schema.Types.ObjectId,
		alias: 'userId',
		ref: 'User'
	},
	
	appTheme: {
		/* {
			0: 'light',
			1: 'dark'
		} */
		type: Number,
		default: 0,
		maxlength: 2
	},
}, { _id: false })

export default mongoose.models.Setting || mongoose.model('Setting', schema)