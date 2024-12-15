import React, { useEffect, useState } from 'react';
import { BookCard } from '../components/Book/BookCard';
import { api } from '../services/api';

interface Book {
  id: string;
  title: string;
  description: string;
  price: string;
  imageUrl?: string;
}

const Home = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBooks = async () => {
      try {const response = await api.get('/books');
        setBooks(response.data.data);
      } catch (err) {
        setError('Erreur lors du chargement des livres');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, []);

  if (loading) return <div className="loading">Chargement...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="home">
      <h1>Catalogue de livres</h1>
      <div className="books-grid">
        {books.map((book) => (
          <BookCard
            key={book.id}
            id={book.id}
            title={book.title}
            description={book.description}
            price={Number(book.price)}
            imageUrl={book.imageUrl}
          />
        ))}
      </div>
    </div>
  );
};

export default Home;