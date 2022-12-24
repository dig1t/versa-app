import mongoose, { Schema } from 'mongoose'

const profileSchema = new Schema({
	name: {
		type: String,
		required: true,
		maxlength: 24
	},
	phone: Number,
	profilePhoto: String,
	bannerPhoto: String,
	website: String,
	bio: {
		type: String,
		maxlength: 50
	},
	lastActive: {
		type: Date,
		default: Date.now()
	},
	user: {
		type: Schema.Types.ObjectId,
		ref: 'User',
		required: true
	}
})

export default mongoose.model('Profile', profileSchema)