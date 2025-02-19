import mongoose, { Schema } from 'mongoose'

import { mongoSession } from '../util/mongoHelpers.js'

import Content from './Content.js'
import Comment from './Comment.js'
import Post from './Post.js'
import Follower from './Follower.js'

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

	followers: {
		type: Number,
		default: 0
	},
	following: {
		type: Number,
		default: 0
	},

	created: {
		type: Date,
		default: Date.now
	}
}, { _id: false })

schema.pre('save', function(next) {
	this.username = this._id

	next()
})

schema.pre(
	'deleteOne',
	{ document: false, query: true },
	async function(next) {
		const userId = this._conditions._id

		await Content.deleteMany({ userId })
		await Comment.deleteMany({ userId })
		await Post.deleteMany({ userId })
		await Follower.deleteMany({ userId })

		next()
	}
)

schema.index({ username: 1 })
schema.index({ userId: 1 })
schema.index({ lastActive: -1 })

export default mongoose.models.Profile || mongoose.model('Profile', schema)
