import PDFDocument from 'pdfkit';
import fs from 'fs';
import path from 'path';

export const generatePDF = async (userId: string, book: any): Promise<string> => {
  return new Promise((resolve, reject) => {
    const pdfDirectory = path.join(__dirname, '..', '..', 'pdfs', userId);
    const pdfPath = path.join(pdfDirectory, `${book.id}.pdf`);

    // Crée le répertoire s'il n'existe pas
    if (!fs.existsSync(pdfDirectory)) {
      fs.mkdirSync(pdfDirectory, { recursive: true });
    }

    const doc = new PDFDocument();
    const writeStream = fs.createWriteStream(pdfPath);

    doc.pipe(writeStream);

    doc.fontSize(20).text(`Titre : ${book.title}`, { align: 'center' });
    doc.moveDown();
    doc.fontSize(14).text(`Auteur : ${book.author}`);
    doc.moveDown();
    doc.text(`Description : ${book.description}`);

    doc.end();

    writeStream.on('finish', () => {
      resolve(path.relative(__dirname, pdfPath)); // Retourne le chemin relatif
    });

    writeStream.on('error', (error) => {
      reject(error);
    });
  });
};
