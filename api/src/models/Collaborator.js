import mongoose, { Schema } from 'mongoose'

const schema = new Schema({
	_id: {
		type: Schema.Types.ObjectId,
		alias: 'collabId'
	},
	contentId: {
		type: Schema.Types.ObjectId,
		ref: 'Content',
		required: true
	},
	userId: {
		type: Schema.Types.ObjectId,
		ref: 'User',
		required: true
	}
}, { _id: false })

schema.index({ collabId: 1 })
schema.index({ contentId: 1 })
schema.index({ userId: 1 })

export default mongoose.models.Collaborator || mongoose.model('Collaborator', schema)
