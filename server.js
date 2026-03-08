import express from 'express';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import authRoutes from './routes/authRoute.js';
import userRoutes from './routes/userRoute.js';
import postRoutes from './routes/postRoute.js';
import errorHandler from './middlewares/errorMiddleware.js';
import cors from 'cors';
dotenv.config();

const app = express();
connectDB();

app.use(
	cors({
		origin: '*',
	}),
);
app.use(errorHandler);
app.use(express.json());
app.get('/', (req, res) => res.send('API is running'));
app.get('/api', (req, res) => res.send({ data: 'API is running' }));
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/posts', postRoutes);

const PORT = process.env.PORT || 5000;

if (process.env.NODE_ENV !== 'production') {
	app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}

export default app;
