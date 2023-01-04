import mongoose, { Schema } from 'mongoose'

const profileSchema = new Schema({
	_id: {
		type: Schema.Types.ObjectId,
		alias: 'userId',
		ref: 'User'
	},
	username: {
		type: String,
		maxlength: 24
	},
	name: {
		type: String,
		required: true,
		maxlength: 24
	},
	avatar: String,
	bannerPhoto: String,
	bio: {
		type: String,
		maxlength: 50
	},
	website: {
		type: String,
		maxlength: 50
	},
	phone: {
		type: Number,
		maxlength: 15
	},
	lastActive: {
		type: Date,
		default: Date.now()
	}
}, { _id: false })

profileSchema.pre('save', function(next) {
	this.username = this._id
	
	next()
})

export default mongoose.model('Profile', profileSchema)