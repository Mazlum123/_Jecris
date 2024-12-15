import PDFDocument from 'pdfkit';
import { Book } from '../db/schema';

export const generateBookPDF = async (book: Book): Promise<Buffer> => {
  const doc = new PDFDocument();
  const buffers: Buffer[] = [];

  doc.on('data', (buffer: Buffer) => buffers.push(buffer));

  doc
    .fontSize(20)
    .text(book.title, { align: 'center' })
    .moveDown()
    .fontSize(12)
    .text('Lorem ipsum...', { align: 'justify' });

  doc.end();

  return new Promise((resolve) => {
    doc.on('end', () => {
      resolve(Buffer.concat(buffers));
    });
  });
};