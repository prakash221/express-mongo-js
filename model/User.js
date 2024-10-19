import mongoose from 'mongoose'

const userSchema = new mongoose.Schema({
	first_name: { type: String, required: true },
	last_name: { type: String, required: true },
	address: { type: String, required: true },
	contact_number: { type: String, required: true },
	email: { type: String, required: true, unique: true },
	password: { type: String, required: true },
	profile_picture: { type: String },
	resetPasswordToken: { type: String },
	resetPasswordExpires: { type: Date },
})

export default mongoose.model('User', userSchema)
