import React from 'react';
import { api } from '../../services/api';

interface LibraryItemProps {
  id: string;
  title: string;
  imageUrl?: string;
}

export const LibraryItem: React.FC<LibraryItemProps> = ({ id, title, imageUrl }) => {
  const handleDownload = async () => {
    try {
      const response = await api.get(`/download/${id}`, {
        responseType: 'blob'
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${title}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error('Download error:', error);
    }
  };

  return (
    <div className="library-item">
      {imageUrl && (
        <div className="library-item__image">
          <img src={imageUrl} alt={title} />
        </div>
      )}
      <h3 className="library-item__title">{title}</h3>
      <span className="library-item__status">Dans la bibliothèque</span>
      <button 
        className="library-item__download"
        onClick={handleDownload}
      >
        Télécharger
      </button>
    </div>
  );
};