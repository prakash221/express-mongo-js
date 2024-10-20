import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import User from '../model/User.js'

// Register
export const register = async (req, res) => {
	const { first_name, last_name, address, contact_number, email, password } =
		req.body
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
	return res.status(201).json({ message: 'User registered successfully' })
}

// Login
export const login = async (req, res) => {
	const { email, password } = req.body
	const user = await User.findOne({ email })

	if (!user || !(await bcrypt.compare(password, user.password))) {
		return res.status(400).json({ message: 'Invalid email or password' })
	}

	const token = jwt.sign(
		{
			userId: user._id,
			email: user.email,
			first_name: user.first_name,
			last_name: user.last_name,
		},
		process.env.JWT_SECRET,
		{
			expiresIn: '1h',
		}
	)
	return res.status(200).json({ user, token })
}

// Forgot Password (dummy implementation)
export const forgotPassword = async (req, res) => {
	const { email } = req.body
	// get user
	const user = User.findOne({ email })
	if (!user) {
		return res.status(404).json({ message: 'User not found' })
	}
	// random token like 453263
	const token = Math.floor(100000 + Math.random() * 900000).toString()
	const hashedToken = await bcrypt.hash(token, 10)
	await User.findOneAndUpdate(
		{ email },
		{
			resetPasswordToken: hashedToken,
			resetPasswordExpires: Date.now() + 3600000,
		}
	)

	return res.status(200).json({ message: `Password reset token ${token}` })
}

// Reset Password (dummy implementation)
export const resetPassword = async (req, res) => {
	const { email, token, password } = req.body
	const user = await User.findOne({ email })
	if (!user) {
		return res.status(404).json({ message: 'User not found' })
	}
	if (Date.now() > user.resetPasswordExpires) {
		return res.status(400).json({ message: 'Token expired' })
	}
	if (!(await bcrypt.compare(token, user.resetPasswordToken))) {
		return res.status(400).json({ message: 'Invalid token' })
	}
	const hashedPassword = await bcrypt.hash(password, 10)
	await User.findOneAndUpdate(
		{ email },
		{
			password: hashedPassword,
			resetPasswordToken: null,
			resetPasswordExpires: null,
		}
	)

	return res.status(200).json({ message: 'Password reset successfully' })
}
