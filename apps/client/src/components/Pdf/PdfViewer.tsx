'use client';
import React, { useState, useRef } from 'react';
import { pdfjs, Document, Page } from 'react-pdf';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import 'react-pdf/dist/esm/Page/TextLayer.css';

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/legacy/build/pdf.worker.min.js',
  import.meta.url
).toString();

const PdfViewer: React.FC = () => {
  const [file, setFile] = useState<string>('./sample.pdf');
  const [numPages, setNumPages] = useState<number | null>(null);

  const onDocumentLoadSuccess = (document: { numPages: number }) => {
    setNumPages(document.numPages);
  };

  const onFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { files } = event.target;
    if (files?.[0]) {
      setFile(URL.createObjectURL(files[0]));
    }
  };

  return (
    <div>
      <Document file={file} onLoadSuccess={onDocumentLoadSuccess}>
        {numPages &&
          Array.from({ length: numPages }, (_, index) => (
            <Page key={`page_${index + 1}`} pageNumber={index + 1} />
          ))}
      </Document>
      <input type="file" accept="application/pdf" onChange={onFileChange} />
    </div>
  );
};

export default PdfViewer;
