import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import router from './routes';
import https from 'https';
import fs from 'fs';

// Charger les variables d'environnement
dotenv.config();
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const app = express();
const PORT = process.env.PORT || 4000;

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
}));

app.use(express.json());

// Route de test
app.get('/', (req: Request, res: Response) => {
  res.json({ message: 'Server is running!' });
});

// Routes API
app.use('/api', router);

// Configuration pour HTTPS en production
if (process.env.NODE_ENV === 'production') {
  const privateKey = fs.readFileSync('/etc/ssl/private/private.key', 'utf8');
  const certificate = fs.readFileSync('/etc/ssl/certs/certificate.crt', 'utf8');
  const credentials = { key: privateKey, cert: certificate };

  const httpsServer = https.createServer(credentials, app);
  httpsServer.listen(443, () => {
    console.log(`Server running securely on https://localhost:443`);
  });
} else {
  // Serveur HTTP pour le développement
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}
