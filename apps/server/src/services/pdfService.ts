import PDFDocument from 'pdfkit';
import fs from 'fs';
import path from 'path';

const getPdfBasePath = () => {
  if (process.env.NODE_ENV === 'production') {
    return path.join(process.cwd(), 'pdfs');
  }
  return path.join(__dirname, '..', '..', 'pdfs');
};

export const generatePDF = async (
  userId: string,
  book: { 
    id: string; 
    title: string; 
    content: string; 
    description: string;
    author?: { name: string };
  }
): Promise<string> => {
  const pdfDir = path.join(__dirname, '..', '..', 'pdfs', userId);
  if (!fs.existsSync(pdfDir)) {
    fs.mkdirSync(pdfDir, { recursive: true });
  }

  
  const pdfPath = path.join(pdfDir, `${book.id}.pdf`);
  const doc = new PDFDocument({
    size: 'A4',
    margins: { top: 50, bottom: 50, left: 50, right: 50 }
  });
  

  return new Promise((resolve, reject) => {
    doc.pipe(fs.createWriteStream(pdfPath));

    // Page de couverture
    doc.fontSize(30).text(book.title, { align: 'center', marginTop: 200 });
    doc.moveDown(2);
    if (book.author) {
      doc.fontSize(16).text(`par ${book.author.name}`, { align: 'center' });
    }
    doc.moveDown(4);
    doc.fontSize(12).text(book.description, { align: 'justify' });
    
    // Nouvelle page pour le contenu
    doc.addPage();
    
    // En-tête
    doc.fontSize(10).text(book.title, { align: 'right' });
    doc.moveTo(50, 70).lineTo(545, 70).stroke();
    
    // Contenu principal
    doc.moveDown();
    doc.fontSize(12).text(book.content, {
      align: 'justify',
      columns: 1,
      columnGap: 15,
      height: 700
    });

    // Pied de page
    doc.fontSize(8).text(
      `© ${new Date().getFullYear()} - Tous droits réservés`,
      50,
      doc.page.height - 50,
      { align: 'center' }
    );

    doc.end();

    doc.on('end', () => resolve(`pdfs/${userId}/${book.id}.pdf`));
    doc.on('error', reject);
  });
};
