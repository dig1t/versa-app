import mongoose, { Schema } from 'mongoose'
import bcrypt from 'bcrypt'

const userSchema = new Schema({
	userId: {
		type: String,
		required: true,
		unique: true
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
	isAdmin: {
		type: Boolean,
		default: false
	},
	isMod: {
		type: Boolean,
		default: false
	},
	profile: {
		type: Schema.Types.ObjectId,
		ref: 'Profile'
	}
})

userSchema.methods.hashString = async password => {
	try {
		const salt = await bcrypt.genSalt(8)
		return await bcrypt.hashSync(password, salt, null)
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