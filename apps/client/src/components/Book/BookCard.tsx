import React, { useState } from 'react';
import { useCartStore } from '../../store/useCartStore';
import { useNotificationStore } from '../../store/useNotificationStore';

interface BookCardProps {
  id: string;
  title: string;
  description: string;
  price: number;
  imageUrl?: string;
}

export const BookCard: React.FC<BookCardProps> = ({
  id,
  title,
  description,
  price,
  imageUrl
}) => {
  const [isAdding, setIsAdding] = useState(false);
  const addItem = useCartStore(state => state.addItem);
  const addNotification = useNotificationStore(state => state.addNotification);

  const handleAddToCart = () => {
    setIsAdding(true);
    try {
      addItem({ id, title, price, imageUrl });
      addNotification(`${title} ajouté au panier`, 'success');
    } catch (error) {
      addNotification('Erreur lors de l\'ajout au panier', 'error');
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <div className="book-card">
      {imageUrl && (
        <div className="book-card__image">
          <img src={imageUrl} alt={title} loading="lazy" />
        </div>
      )}
      <div className="book-card__content">
        <h3 className="book-card__title">{title}</h3>
        <p className="book-card__price">{price.toFixed(2)}€</p>
        <p className="book-card__description">{description}</p>
        <button 
          className={`book-card__button ${isAdding ? 'loading' : ''}`}
          onClick={handleAddToCart}
          disabled={isAdding}
        >
          {isAdding ? (
            <span className="loading-text">
              <span className="loading-dots">Ajout en cours</span>
            </span>
          ) : (
            'Ajouter au panier'
          )}
        </button>
      </div>
    </div>
  );
};

export default BookCard;