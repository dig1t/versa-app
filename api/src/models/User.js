import mongoose, { Schema } from 'mongoose'
import bcrypt from 'bcrypt'

import { mongoSession } from '../util/mongoHelpers.js'
import Profile from './Profile.js'
import UserSession from './UserSession.js'

const schema = new Schema({
	_id: {
		type: Schema.Types.ObjectId,
		alias: 'userId'
	},
	created: {
		type: Date,
		default: Date.now
	},
	email: {
		type: String,
		required: true,
		unique: true
	},
	password: String,
	usePassword: { // if user signed up using SSO, this will be disabled
		type: Boolean,
		default: true
	},
	isAdmin: {
		type: Boolean,
		default: false
	},
	isMod: {
		type: Boolean,
		default: false
	}
}, { _id: false })

schema.methods.hashString = async (password) => {
	try {
		const salt = await bcrypt.genSalt(8)
		return bcrypt.hashSync(password, salt, null)
	} catch(error) {
		console.log(error)
	}
}

schema.methods.validPassword = async function(password) {
	try {
		return await bcrypt.compareSync(password, this.password)
	} catch(error) {
		console.log(error)
	}
}

schema.pre(
	'deleteOne',
	{ document: false, query: true },
	async function(next) {
		const userId = this._conditions._id
		
		await Profile.deleteOne({ userId })
		await UserSession.deleteMany({ userId })
		
		next()
	}
)

export default mongoose.models.User || mongoose.model('User', schema)