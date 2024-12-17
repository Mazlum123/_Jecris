import { exec } from 'child_process';
import { format } from 'date-fns';

const backupDatabase = () => {
  const date = format(new Date(), 'yyyy-MM-dd-HH-mm');
  const filename = `backup-${date}.sql`;

  exec(`pg_dump ${process.env.DATABASE_URL} > backups/${filename}`, (error) => {
    if (error) {
      console.error('Backup failed:', error);
      return;
    }
    console.log('Backup successful:', filename);
  });
};
