import cron from 'node-cron';
import { exec } from 'child_process';
import { uploadToS3 } from '../services/s3';

const backupDatabase = async () => {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const filename = `backup-${timestamp}.sql`;
  
  try {
    // Créer le backup
    await new Promise((resolve, reject) => {
      exec(
        `pg_dump ${process.env.DATABASE_URL} > ${filename}`,
        (error, stdout, stderr) => {
          if (error) reject(error);
          else resolve(stdout);
        }
      );
    });

    // Uploader vers S3
    await uploadToS3(filename, `backups/${filename}`);
    
    console.log(`Backup successful: ${filename}`);