export const sendPurchaseEmail = async (
    userId: string,
    bookTitle: string,
    pdfPath: string
  ): Promise<void> => {
    // TODO: Implémenter l'envoi d'email
    console.log(`Email would be sent to user ${userId} for book ${bookTitle}`);
  };