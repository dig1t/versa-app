import mongoose, { Schema } from 'mongoose'
import bcrypt from 'bcrypt'

const userSchema = new Schema({
	_id: {
		type: Schema.Types.ObjectId,
		alias: 'userId'
	},
	createdAt: {
		type: Date,
		default: Date.now()
	},
	email: {
		type: String,
		required: true,
		unique: true
	},
	password: {
		type: String,
		required: true
	},
	passwordEnabled: { // if user signed up using SSO, this will be disabled
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

userSchema.methods.hashString = async password => {
	try {
		const salt = await bcrypt.genSalt(8)
		return bcrypt.hashSync(password, salt, null)
	} catch(e) {
		console.error(e)
	}
}

userSchema.methods.validPassword = async function(password) {
	try {
		return await bcrypt.compareSync(password, this.password)
	} catch(e) {
		console.error(e)
	}
}

export default mongoose.model('User', userSchema)