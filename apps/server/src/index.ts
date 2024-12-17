import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import router from './routes';
import https from 'https';
import fs from 'fs';

dotenv.config();
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const app = express();
const PORT = process.env.PORT || 3000;

if (process.env.NODE_ENV === 'production') {
  const privateKey = fs.readFileSync('/etc/ssl/private/private.key', 'utf8');
  const certificate = fs.readFileSync('/etc/ssl/certs/certificate.crt', 'utf8');
  const credentials = { key: privateKey, cert: certificate };

  const httpsServer = https.createServer(credentials, app);
  httpsServer.listen(443);
} else {
  app.listen(process.env.PORT || 3000);
}

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