import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface BookForm {
  title: string;
  price: string;
  description: string;
}

export default function AddBook() {
  const navigate = useNavigate();
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [book, setBook] = useState<BookForm>({
    title: '',
    price: '',
    description: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Validation basique
      if (!book.title || !book.price) {
        throw new Error('Le titre et le prix sont requis');
      }

      const price = parseFloat(book.price);
      if (isNaN(price) || price <= 0) {
        throw new Error('Le prix doit être un nombre positif');
      }

      // Appel API (à implémenter)
      const response = await fetch(`${import.meta.env.VITE_API_URL}/books`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...book,
          price: price
        }),
      });

      if (!response.ok) {
        throw new Error('Erreur lors de l\'ajout du livre');
      }

      // Redirection vers la page d'accueil
      navigate('/');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setBook(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="add-book">
      <h1>Ajouter un nouveau livre</h1>

      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="title">Titre</label>
          <input
            type="text"
            id="title"
            name="title"
            value={book.title}
            onChange={handleChange}
            required
            disabled={loading}
          />
        </div>

        <div className="form-group">
          <label htmlFor="price">Prix</label>
          <input
            type="number"
            id="price"
            name="price"
            value={book.price}
            onChange={handleChange}
            step="0.01"
            min="0"
            required
            disabled={loading}
          />
        </div>

        <div className="form-group">
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            name="description"
            value={book.description}
            onChange={handleChange}
            rows={4}
            disabled={loading}
          />
        </div>

        <div className="form-actions">
          <button
            type="button"
            onClick={() => navigate('/')}
            disabled={loading}
            className="button button-secondary"
          >
            Annuler
          </button>
          <button
            type="submit"
            disabled={loading}
            className="button button-primary"
          >
            {loading ? 'Ajout en cours...' : 'Ajouter le livre'}
          </button>
        </div>
      </form>
    </div>
  );
}