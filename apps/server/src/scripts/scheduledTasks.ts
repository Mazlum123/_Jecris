import cron from 'node-cron';
import { backupDatabase } from './backup';

// Backup quotidien à 3h du matin
cron.schedule('0 3 * * *', () => {
  backupDatabase();
});

// Nettoyage des vieux backups (garde 7 jours)
cron.schedule('0 4 * * *', () => {
  cleanOldBackups(7);
});