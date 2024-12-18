import React from 'react';
import PdfViewer from '../components/Pdf/PdfViewer';

const PdfPage: React.FC = () => {
  return (
    <div className="pdf-page">
      <h1>Affichage du PDF</h1>
      <PdfViewer />
    </div>
  );
};

export default PdfPage;
