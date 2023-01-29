import mongoose, { Schema } from 'mongoose'

const schema = new Schema({
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
	verificationLevel: {
		type: Number,
		maxlength: 1,
		default: 0
	},
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

schema.pre('save', function(next) {
	this.username = this._id
	
	next()
})

export default mongoose.model('Profile', schema)