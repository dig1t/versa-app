import mongoose, { Schema } from 'mongoose'
import bcrypt from 'bcrypt'

const schema = new Schema({
	_id: {
		type: Schema.Types.ObjectId,
		alias: 'userId'
	},
	created: {
		type: Date,
		default: new Date().toISOString()
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

schema.methods.hashString = async password => {
	try {
		const salt = await bcrypt.genSalt(8)
		return bcrypt.hashSync(password, salt, null)
	} catch(e) {
		console.error(e)
	}
}

schema.methods.validPassword = async function(password) {
	try {
		return await bcrypt.compareSync(password, this.password)
	} catch(e) {
		console.error(e)
	}
}

schema.pre('deleteOne', { document: true, query: false }, function() {
    this.model('Profile').deleteOne({ userId: this._id })
	this.model('UserSession').deleteMany({ userId: this._id })
})

export default mongoose.model('User', schema)