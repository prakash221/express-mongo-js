import { slugify } from '../config/slugify.js'
import Post from '../model/Post.js'

// Create a new post
export const createPost = async (req, res) => {
	const { title, content, image } = req.body
	const author = req.user._id
	try {
		const slug = slugify(title)
		// find if post already exists
		const existingPost = await Post.findOne({ slug })
		if (existingPost) {
			return res
				.status(400)
				.json({ message: 'Post already exists', data: null })
		}
		const post = new Post({
			title,
			slug,
			content,
			author,
			image,
		})
		await post.save()
		res.status(201).json({ message: 'Post created successfully', data: post })
	} catch (error) {
		res.status(400).json({ message: error.message, data: null })
	}
}

// Get a post by slug
export const getPostBySlug = async (req, res) => {
	const { slug } = req.params
	try {
		const post = await Post.findOne({ slug })
			.populate('author', 'first_name last_name')
			.populate('comments.commented_by', 'first_name last_name')
		if (!post) {
			return res.status(404).json({ message: 'Post not found', data: null })
		}
		res.status(200).json({ message: 'Post retrieved successfully', data: post })
	} catch (error) {
		res.status(400).json({ message: error.message, data: null })
	}
}

// Get all posts
export const getLatestPosts = async (req, res) => {
	const { page = 1, limit = 10 } = req.query
	try {
		const posts = await Post.aggregate([
			{
				$sort: { created_at: -1 },
			},
			{
				$skip: (page - 1) * limit,
			},
			{
				$limit: parseInt(limit),
			},
			{
				$project: {
					_id: 1,
					title: 1,
					author: 1,
					image: 1,
					created_at: 1,
					comment_count: { $size: '$comments' },
					reaction_count: { $size: '$reactions' },
				},
			},
			{
				$lookup: {
					from: 'users',
					localField: 'author',
					foreignField: '_id',
					as: 'author',
				},
			},
			{
				$project: {
					_id: 1,
					title: 1,
					image: 1,
					created_at: 1,
					comment_count: 1,
					reaction_count: 1,
					'author.first_name': 1,
					'author.last_name': 1,
				},
			},
		])

		res.status(200).json(posts)
	} catch (error) {
		res.status(400).json({ error: error.message })
	}
}

// delete a post by id but only the author can delete
export const deletePost = async (req, res) => {
	const { postId } = req.params
	const author = req.user._id
	try {
		const post = await Post.findOne({ _id: postId, author: author })
		if (!post) {
			return res.status(404).json({
				message: 'Post not found or you are not authorized to delete this post',
				data: null,
			})
		}
		await Post.findByIdAndDelete(postId)
		res.status(200).json({ message: 'Post deleted successfully', data: null })
	} catch (error) {
		res.status(400).json({ message: error.message, data: null })
	}
}
// Add a comment to a post
export const addComment = async (req, res) => {
	try {
		const { postId } = req.params
		const comment = {
			comment: req.body.comment,
			commented_by: req.user._id,
			created_at: new Date(),
		}
		const post = await Post.findByIdAndUpdate(
			{ _id: postId },
			{ $push: { comments: comment } },
			{ new: true }
		)
		res.status(201).json({ message: 'Comment added successfully', data: post })
	} catch (error) {
		res.status(400).json({ message: error.message })
	}
}

// remove a comment from a post by id but only the author can delete
export const removeComment = async (req, res) => {
	const { postId, commentId } = req.params
	const commented_by = req.user._id
	try {
		const post = await Post.findOne({
			_id: postId,
			'comments._id': commentId,
			'comments.commented_by': commented_by,
		})

		if (!post) {
			return res.status(404).json({
				message: 'Post or comment not found',
				data: null,
			})
		}
		await Post.findByIdAndUpdate(postId, {
			$pull: { comments: { _id: commentId, commented_by: commented_by } },
		})
		res
			.status(200)
			.json({ message: 'Comment deleted successfully', data: null })
	} catch (error) {
		res.status(400).json({ message: error.message, data: null })
	}
}

// Add a reaction to a post
export const addReaction = async (req, res) => {
	try {
		const { postId } = req.params
		const reacted_by = req.user._id
		const reactionObj = {
			reaction: req.body.reaction,
			reacted_by: reacted_by,
		}

		const oldPost = await Post.findOne({
			_id: postId,
			'reactions.reacted_by': reacted_by,
		})
		if (oldPost) {
			await Post.findByIdAndUpdate(postId, {
				$pull: { reactions: { reacted_by: reacted_by } },
			})
		}
		const post = await Post.findByIdAndUpdate(
			{ _id: postId },
			{
				$push: { reactions: reactionObj },
			},
			{ new: true }
		)
		res
			.status(201)
			.json({ message: req.body.reaction + ' added successfully', data: post })
	} catch (error) {
		res.status(400).json({ message: error.message })
	}
}

// remove a reaction from a post by id but only the author can delete
export const removeReaction = async (req, res) => {
	const { postId } = req.params
	const reacted_by = req.user._id
	try {
		const post = await Post.findOne({
			_id: postId,
			'reactions.reacted_by': reacted_by,
		})

		if (!post) {
			return res.status(404).json({
				message: 'Post or react not found',
				data: null,
			})
		}
		await Post.findByIdAndUpdate(postId, {
			$pull: { reactions: { reacted_by: reacted_by } },
		})
		res.status(200).json({ message: 'React deleted successfully', data: null })
	} catch (error) {
		res.status(400).json({ message: error.message, data: null })
	}
}
