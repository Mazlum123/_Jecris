import sharp from 'sharp';
import path from 'path';

export const optimizeImage = async (inputPath: string): Promise<string> => {
  const ext = path.extname(inputPath);
  const optimizedPath = inputPath.replace(ext, `-optimized${ext}`);

  await sharp(inputPath)
    .resize(800, 800, {
      fit: 'inside',
      withoutEnlargement: true
    })
    .jpeg({ quality: 80 })
    .toFile(optimizedPath);

  return optimizedPath;
};