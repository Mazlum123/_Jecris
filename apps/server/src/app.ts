import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import booksRouter from './routes/books';

const app = express();

// Middleware minimal
app.use(cors({ origin: 'http://localhost:5173', credentials: true }));
app.use(cookieParser());
app.use(express.json());

// Routes
app.use('/api', booksRouter);

// Serveur
app.listen(4000, () => {
  console.log('Serveur démarré sur http://localhost:4000');
});

export default app;
