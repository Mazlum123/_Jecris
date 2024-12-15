import fs from 'fs/promises';
import path from 'path';

export const saveFile = async (filePath: string, content: Buffer): Promise<void> => {
  const fullPath = path.join(__dirname, '../../uploads', filePath);
  await fs.mkdir(path.dirname(fullPath), { recursive: true });
  await fs.writeFile(fullPath, content);
};