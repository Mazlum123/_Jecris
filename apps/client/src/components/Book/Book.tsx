// apps/client/src/components/Book/Book.tsx
import { useCartStore } from '../../store/useCartStore';

interface BookProps {
  id: string;
  title: string;
  price: number;
  description: string;
}

export default function Book({ id, title, price, description }: BookProps) {
  const addItem = useCartStore((state) => state.addItem);

  return (
    <div className="book-card">
      <h3>{title}</h3>
      <p className="price">{price}€</p>
      <p className="description">{description}</p>
      <button
        onClick={() => addItem({ id, title, price })}
        className="add-to-cart"
      >
        Ajouter au panier
      </button>
    </div>
  );
}