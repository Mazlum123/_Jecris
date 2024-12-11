import { useEffect, useState } from 'react';
import Book from '@components/Book/Book';

interface Book {
  id: string;
  title: string;
  price: number;
  description: string;
}

export default function Home() {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Pour le moment, utilisons des données mockées
    setBooks([
      {
        id: '1',
        title: 'Le Petit Prince',
        price: 9.99,
        description: 'Un classique de la littérature française'
      },
      {
        id: '2',
        title: '1984',
        price: 12.99,
        description: 'Un roman dystopique visionnaire'
      }
    ]);
    setLoading(false);
  }, []);

  if (loading) return <div>Chargement...</div>;

  return (
    <div className="home">
      <h1>Bibliothèque</h1>
      <div className="books-grid">
        {books.map((book) => (
          <Book key={book.id} {...book} />
        ))}
      </div>
    </div>
  );
}