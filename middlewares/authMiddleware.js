import jwt from 'jsonwebtoken'
import asyncHandler from 'express-async-handler'

import User from '../model/User.js'

const protect = asyncHandler(async (req, res, next) => {
	let token
	if (
		req.headers.authorization &&
		req.headers.authorization.startsWith('Bearer')
	) {
		try {
			token = req.headers.authorization.split(' ')[1]
			const decoded = jwt.verify(token, process.env.JWT_SECRET)
			console.log(decoded)

			req.user = await User.findById(decoded.userId).select(
				'-password -resetPasswordExpires -resetPasswordToken'
			)

			next()
		} catch (error) {
			console.error(error)
			res.status(401)
			throw new Error('Not authorized, token Failed')
		}
	}

	if (!token) {
		res.status(401)
		throw new Error('Not authorized, no token')
	}
})
export { protect }
