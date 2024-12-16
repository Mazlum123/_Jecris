import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import { useNotificationStore } from '../store/useNotificationStore';
import { useAuthStore } from '../store/authStore';

interface Book {
  id: string;
  title: string;
  description: string;
  imageUrl?: string;
  pdfUrl?: string;
}

interface Purchase {
  id: string;
  book: Book;
  purchaseDate: string;
  pdfUrl: string;
}

export const Library: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthStore();
  const addNotification = useNotificationStore(state => state.addNotification);

  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/auth/login');
      return;
    }

    const fetchPurchases = async () => {
      try {
        setIsLoading(true);
        const response = await api.get('/purchases');
        setPurchases(response.data.data);
      } catch (err) {
        console.error('Erreur lors du chargement des achats:', err);
        setError('Impossible de charger vos livres. Veuillez réessayer plus tard.');
        addNotification('Erreur lors du chargement de votre bibliothèque', 'error');
      } finally {
        setIsLoading(false);
      }
    };

    fetchPurchases();
  }, [isAuthenticated, navigate, addNotification]);

  const handleDownload = async (bookId: string, title: string) => {
    try {
      addNotification('Téléchargement en cours...', 'info');

      const response = await api.get(`/books/${bookId}/download`, {
        responseType: 'blob'
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);

      addNotification('Téléchargement réussi !', 'success');
    } catch (err) {
      console.error('Erreur lors du téléchargement:', err);
      addNotification('Erreur lors du téléchargement du livre', 'error');
    }
  };

  const handleReadOnline = (pdfUrl: string, title: string) => {
    try {
      window.open(pdfUrl, '_blank', 'noopener,noreferrer');
    } catch (err) {
      console.error('Erreur lors de l\'ouverture du PDF:', err);
      addNotification('Impossible d\'ouvrir le livre en ligne', 'error');
    }
  };

  if (isLoading) {
    return (
      <div className="library">
        <div className="library-loading">
          <p>Chargement de votre bibliothèque...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="library">
        <div className="library-error">
          <p>{error}</p>
          <button 
            onClick={() => window.location.reload()} 

className="library-error__button"
>
  Réessayer
</button>
</div>
</div>
);
}

return (
<div className="library">
<h1>Ma bibliothèque</h1>

{purchases && purchases.length > 0 ? (
<div className="library-grid">
{purchases.map((purchase) => (
  <div key={purchase.id} className="library-item">
    {purchase.book.imageUrl && (
      <div className="library-item__image">
        <img 
          src={purchase.book.imageUrl} 
          alt={`Couverture de ${purchase.book.title}`} 
          loading="lazy"
        />
      </div>
    )}

    <div className="library-item__content">
      <h3 title={purchase.book.title}>{purchase.book.title}</h3>
      <p className="library-item__date">
        Acheté le {new Date(purchase.purchaseDate).toLocaleDateString('fr-FR', {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        })}
      </p>

      {purchase.book.description && (
        <p className="library-item__description" title={purchase.book.description}>
          {purchase.book.description}
        </p>
      )}

      <div className="library-item__actions">
        <button 
          onClick={() => handleDownload(purchase.book.id, purchase.book.title)}
          className="library-item__download"
          aria-label={`Télécharger ${purchase.book.title}`}
        >
          <span>Télécharger</span>
        </button>

        <button 
          onClick={() => handleReadOnline(purchase.pdfUrl, purchase.book.title)}
          className="library-item__read"
          aria-label={`Lire ${purchase.book.title} en ligne`}
        >
          <span>Lire en ligne</span>
        </button>
      </div>
    </div>
  </div>
))}
</div>
) : (
<div className="library-empty">
<h2>Votre bibliothèque est vide</h2>
<p>
  Vous n'avez pas encore de livres dans votre bibliothèque.
  Découvrez notre catalogue et commencez votre collection !
</p>
<button
  onClick={() => navigate('/')}
  className="library-empty__button"
  aria-label="Découvrir le catalogue"
>
  Découvrir nos livres
</button>
</div>
)}
</div>
);
};

export default Library;