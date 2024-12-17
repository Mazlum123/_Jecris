import fs from 'fs/promises';
import path from 'path';

async function cleanup() {
  const tempDirs = ['pdfs', 'uploads/temp'];
  const maxAge = 24 * 60 * 60 * 1000; // 24 heures

  for (const dir of tempDirs) {
    const dirPath = path.join(__dirname, '../../', dir);
    try {
      const files = await fs.readdir(dirPath);

      for (const file of files) {
        const filePath = path.join(dirPath, file);
        const stats = await fs.stat(filePath);

        if (Date.now() - stats.mtime.getTime() > maxAge) {
          await fs.unlink(filePath);
          console.log(`Deleted: ${filePath}`);
        }
      }
    } catch (error) {
      console.error(`Error cleaning ${dir}:`, error);
    }
  }
}

// Exécuter le nettoyage quotidiennement
if (require.main === module) {
  cleanup();
}

export { cleanup };