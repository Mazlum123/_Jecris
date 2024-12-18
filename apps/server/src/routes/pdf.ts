import { Router, Request, Response } from 'express';
import { generatePDF } from '../services/pdfService';

const router = Router();

router.get('/generate-pdf', (_, res: Response) => {
  const filePath = 'output.pdf';

  try {
    generatePDF(filePath);
    res.json({ message: 'PDF généré avec succès', file: filePath });
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la génération du PDF', error });
  }
});

export default router;