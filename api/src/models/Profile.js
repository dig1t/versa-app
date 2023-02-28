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
	verificationLevel: { // TODO: REPLACE WITH PROFILE BADGES
		type: Number,
		min: 0,
		max: 1,
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
	},
	followers: 0,
	following: 0,
	created: {
		type: Date,
		default: new Date().toISOString()
	}
}, { _id: false })

schema.pre('save', function(next) {
	this.username = this._id
	
	next()
})

schema.pre(
	'deleteOne',
	{ document: true, query: false },
	function() {
		this.model('Content').deleteMany({ userId: this._id })
		this.model('Comment').deleteMany({ userId: this._id })
		this.model('Post').deleteMany({ userId: this._id })
		this.model('Follower').deleteMany({ userId: this._id })
	}
)

export default mongoose.models.Profile || mongoose.model('Profile', schema)