import mongoose, { Schema } from 'mongoose'

const profileSchema = new Schema({
	_id: Schema.Types.ObjectId,
	name: String,
	phone: Number,
	lastActive: {
		type: Date,
		default: Date.now()
	}
})

export default mongoose.model('Profile', profileSchema)