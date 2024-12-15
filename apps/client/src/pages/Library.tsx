import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { api } from '../services/api';

export const Library = () => {
  const { data: purchases, isLoading } = useQuery({
    queryKey: ['purchases'],
    queryFn: () => api.get('/purchases').then(res => res.data)
  });

  if (isLoading) return <div>Chargement...</div>;

  return (
    <div className="library">
      <h1>Ma bibliothèque</h1>
      <div className="library__grid">
        {purchases?.map((purchase: any) => (
          <div key={purchase.id} className="library-item">
            <h3>{purchase.book.title}</h3>
            <div className="library-item__actions">
              <a 
                href={`${import.meta.env.VITE_API_URL}/downloads/${purchase.pdfUrl}`}
                download
                className="library-item__download"
              >
                Télécharger le PDF
              </a>
              <button 
                onClick={() => window.open(purchase.pdfUrl, '_blank')}
                className="library-item__read"
              >
                Lire en ligne
              </button>
            </div>
            <p className="library-item__date">
              Acheté le {new Date(purchase.purchaseDate).toLocaleDateString()}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};