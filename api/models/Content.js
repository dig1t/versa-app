import mongoose, { Schema } from 'mongoose'

const schema = new Schema({
	_id: {
		type: Schema.Types.ObjectId,
		alias: 'contentId'
	},
	
	userId: {
		type: Schema.Types.ObjectId,
		ref: 'User',
		required: true
	},
	
	body: {
		type: String,
		maxlength: 50
	},
	
	mediaId: {
		type: Schema.Types.ObjectId,
		ref: 'Media'
	},
	
	embedId: {
		type: Schema.Types.ObjectId,
		ref: 'Post'
	},
	embedType: {
		type: Schema.Types.Number,
		maxlength: 1
		/* {
			1: 'normal',
			2: 'quoted',
			3: 'repost',
			4: 'reply',
			5: 'collab' (someone added you as a collaborator)
		} */
	},
	
	collaborators: [{
		type: Schema.Types.ObjectId,
		ref: 'Collaborator'
	}],
	
	// Not real time stats
	// likes: {
	// 	type: Number,
	// 	default: 0
	// },
	// replies: {
	// 	type: Number,
	// 	default: 0
	// },
	// reposts: {
	// 	type: Number,
	// 	default: 0
	// },
	
	created: {
		type: Date,
		maxlength: 27,
		default: new Date().toISOString(),
		required: true
	}
}, { _id: false })

export default mongoose.model('Content', schema)