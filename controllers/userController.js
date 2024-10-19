import bcrypt from 'bcryptjs'
import User from '../model/User.js'

// Dashboard
export const dashboard = async (req, res) => {
	const userCount = await User.countDocuments()
	res.status(200).json({ userCount })
}

// Create User
export const createUser = async (req, res) => {
	const { first_name, last_name, address, contact_number, email, password } =
		req.body

	// find if email already exists
	const user = await User.findOne({ email })
	if (user) {
		return res.status(400).json({ message: 'Email already exists' })
	}

	const hashedPassword = await bcrypt.hash(password, 10)
	const newUser = new User({
		first_name,
		last_name,
		address,
		contact_number,
		email,
		password: hashedPassword,
	})

	await newUser.save()
	res.status(201).json({ message: 'User created successfully', newUser })
}

// get user by id
export const getUserById = async (req, res) => {
	const { id } = req.params
	const user = await User.findById(id).select('-password')
	res.status(200).json(user)
}

// Get Users
export const getUsers = async (req, res) => {
	const users = await User.find().select('-password')
	res.status(200).json(users)
}
// Edit User
export const editUser = async (req, res) => {
	const { id } = req.params
	const { first_name, last_name, address, contact_number, email } = req.body

	const updatedUser = await User.findByIdAndUpdate(
		id,
		{ first_name, last_name, address, contact_number, email },
		{ new: true }
	)
	res.status(200).json(updatedUser)
}
// get my profile
export const getMyProfile = async (req, res) => {
	const authUser = req.user
	res.status(200).json(authUser)
}

// Update Profile
export const updateProfile = async (req, res) => {
	const userId = req.user._id
	console.log(userId)
	const { first_name, last_name, address, contact_number, email } = req.body

	const updatedProfile = await User.findByIdAndUpdate(
		userId,
		{ first_name, last_name, address, contact_number, email },
		{ new: true }
	)
	res.status(200).json(updatedProfile)
}

// Change Password
export const changePassword = async (req, res) => {
	const authUser = req.user
	const { oldPassword, newPassword } = req.body

	const user = await User.findById(authUser._id)
	if (!(await bcrypt.compare(oldPassword, user.password))) {
		return res.status(400).json({ message: 'Incorrect old password' })
	}

	user.password = await bcrypt.hash(newPassword, 10)
	await user.save()
	res.status(200).json({ message: 'Password changed successfully' })
}
