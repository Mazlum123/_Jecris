import fs from 'fs';
import PDFDocument from 'pdfkit';

export const generatePDF = (filePath: string) => {
  const doc = new PDFDocument();

  // Ajouter une marge manuelle via `y`
  const marginTop = 50;

  doc.fontSize(12);
  doc.text("Texte aligné au centre", {
    align: "center",
  });

  // Ajouter un autre texte à une position manuelle
  doc.text("Deuxième ligne avec un espacement manuel", 100, marginTop + 30);

  // Sauvegarde du PDF
  doc.pipe(fs.createWriteStream(filePath)); // Utilisation correcte
  doc.end();
};