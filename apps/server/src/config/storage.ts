import path from 'path';
import fs from 'fs';

export const UPLOAD_DIR = process.env.NODE_ENV === 'production'
  ? path.join(process.cwd(), 'uploads')
  : path.join(__dirname, '../../uploads');

// Création des dossiers nécessaires
export const ensureUploadDirs = () => {
  const dirs = ['pdfs', 'images'].map(dir => path.join(UPLOAD_DIR, dir));
  
  dirs.forEach(dir => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  });
};