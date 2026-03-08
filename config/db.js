import mongoose from 'mongoose';

const connectDB = async () => {
	try {
		await mongoose.connect(process.env.MONGO_URI);
		console.log('MongoDB connected');
	} catch (error) {
		console.error('MongoDB connection error:', error);
		// Remove process.exit(1) for serverless
	}
};

export default connectDB;
