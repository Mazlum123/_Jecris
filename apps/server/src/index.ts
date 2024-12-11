import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import router from './routes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));

app.use(express.json());

// Route de test
app.get('/', (req: Request, res: Response) => {
  res.json({ message: 'Server is running!' });
});

// Routes API
app.use('/api', router);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});