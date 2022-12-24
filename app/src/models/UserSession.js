import mongoose from 'mongoose'

const UserSessionSchema = new mongoose.Schema({
	userId: {
		type: String,
		default: ''
	},
	timestamp: {
		type: Date,
		default: Date.now()
	},
	isDeleted: {
		type: Boolean,
		default: false
	}
})

UserSessionSchema.methods.method = (a, b) => {
	return true
}

mongoose.model('User', UserSessionSchema)