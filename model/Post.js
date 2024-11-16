import mongoose, { Types } from 'mongoose'

const postSchema = new mongoose.Schema({
	title: { type: String, required: true },
	slug: { type: String, required: true, unique: true },
	content: { type: String, required: true },
	author: { type: Types.ObjectId, ref: 'User', required: true },
	image: { type: String, required: true },
	created_at: { type: Date, default: Date.now },
	updated_at: { type: Date, default: Date.now },
	comments: [
		{
			comment: { type: String, required: true },
			commented_by: { type: Types.ObjectId, ref: 'User' },
			created_at: { type: Date, default: Date.now },
		},
	],
	reactions: [
		{
			reaction: {
				type: String,
				enum: ['like', 'love', 'haha', 'wow', 'sad', 'angry'],
				required: true,
			},
			reacted_by: {
				type: Types.ObjectId,
				ref: 'User',
				required: true,
			},
		},
	],
})

export default mongoose.model('Post', postSchema)
