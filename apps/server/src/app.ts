import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import router from './routes';

const app = express();

// Middlewares
app.use(cookieParser());
app.use(express.json());
app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true
}));

// Routes
app.use('/api', router);

export default app;