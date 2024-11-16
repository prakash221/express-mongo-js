import express from 'express'
import {
	createPost,
	getPostBySlug,
	getLatestPosts,
	deletePost,
	addComment,
	removeComment,
	addReaction,
	removeReaction,
} from '../controllers/postController.js'
import { protect } from '../middlewares/authMiddleware.js'

const router = express.Router()

// Post management
router.get('/', getLatestPosts)
router.post('/', protect, createPost)
router.get('/:slug', getPostBySlug)
router.delete('/:postId', protect, deletePost)

// Comment
router.post('/:postId/comment', protect, addComment)
router.delete('/:postId/comment/:commentId', protect, removeComment)

// Reaction
router.post('/:postId/react', protect, addReaction)
router.delete('/:postId/react', protect, removeReaction)

export default router
