import express from 'express'
import {
	dashboard,
	createUser,
	editUser,
	updateProfile,
	changePassword,
	getUserById,
	getUsers,
	getMyProfile,
	deleteUser,
} from '../controllers/userController.js'
import { protect } from '../middlewares/authMiddleware.js'

const router = express.Router()

// Dashboard
router.get('/dashboard', dashboard)

// User management
router.post('/', protect, createUser)
router.get('/', protect, getUsers)
router.get('/profile', protect, getMyProfile)
router.put('/profile', protect, updateProfile)
router.put('/change-password', protect, changePassword)
router.get('/:id', protect, getUserById)
router.put('/:id', protect, editUser)
router.delete('/:id', protect, deleteUser)

// Profile

export default router
