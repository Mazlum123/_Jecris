import { db } from '../db';
import { promises as fs } from 'fs';
import path from 'path';

async function checkPreDeploy() {
  try {
    // Vérifier la connexion à la base de données
    await db.query.users.findMany({ limit: 1 });
    console.log('✅ Database connection successful');

    // Vérifier les variables d'environnement requises
    const requiredEnvVars = [
      'DATABASE_URL',
      'JWT_SECRET',
      'STRIPE_SECRET_KEY',
      'FRONTEND_URL'
    ];

    requiredEnvVars.forEach(varName => {
      if (!process.env[varName]) {
        throw new Error(`Missing environment variable: ${varName}`);
      }
    });
    console.log('✅ Environment variables verified');

    // Vérifier les dossiers nécessaires
    const requiredDirs = ['pdfs', 'uploads'];
    for (const dir of requiredDirs) {
      const dirPath = path.join(__dirname, '../../', dir);
      await fs.mkdir(dirPath, { recursive: true });
    }
    console.log('✅ Required directories created');

    console.log('Pre-deploy checks passed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Pre-deploy checks failed:', error);
    process.exit(1);
  }
}

checkPreDeploy();