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
	created: {
		type: Date,
		maxlength: 27,
		default: new Date().toISOString(),
		required: true
	},
	private: Boolean,
	
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
			1: 'content' // ex: quoting a post
		} */
	},
	
	comments: [{
		type: Schema.Types.ObjectId,
		ref: 'Comment'
	}]
	
	/* collaborators: [{
		type: Schema.Types.ObjectId,
		ref: 'Collaborator'
	}], */
	
	// Not real time stats
	// likes: {
	// 	type: Number,
	// 	default: 0
	// },
	// comments: {
	// 	type: Number,
	// 	default: 0
	// },
	// reposts: {
	// 	type: Number,
	// 	default: 0
	// }
}, { _id: false })

schema.pre(['deleteOne', 'deleteMany'], { document: true, query: false }, function() {
	this.model('Collaborator').deleteMany({ contentId: this._id })
	this.model('Post').deleteMany({ contentId: this._id })
    this.model('Comment').deleteMany({ contentId: this._id })
})

export default mongoose.model('Content', schema)