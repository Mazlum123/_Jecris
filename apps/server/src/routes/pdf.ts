import { Router, Request, Response } from 'express';
import { generatePDF } from '../services/pdfService';

const router = Router();

router.get('/generate-pdf', (_, res: Response) => {
  const filePath = 'output.pdf';
  const additionalData = 'Some additional data for the PDF';  // Ajout d'un deuxième argument

  try {
    generatePDF(filePath, additionalData);  // Passe les deux arguments nécessaires
    res.json({ message: 'PDF généré avec succès', file: filePath });
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la génération du PDF', error });
  }
});

export default router;
