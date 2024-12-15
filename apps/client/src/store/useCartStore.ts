import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface CartItem {
  id: string;
  title: string;
  price: number;
  quantity: number;
  imageUrl?: string;
}

interface CartStore {
  items: CartItem[];
  total: number;
  addItem: (item: Omit<CartItem, 'quantity'>) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set) => ({
      items: [],
      total: 0,

      addItem: (item) => set((state) => {
        const existingItem = state.items.find((i) => i.id === item.id);

        if (existingItem) {
          const updatedItems = state.items.map((i) =>
            i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
          );
          return {
            items: updatedItems,
            total: updatedItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
          };
        }

        const newItems = [...state.items, { ...item, quantity: 1 }];
        return {
          items: newItems,
          total: newItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
        };
      }),

      removeItem: (id) => set((state) => {
        const newItems = state.items.filter((item) => item.id !== id);
        return {
          items: newItems,
          total: newItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
        };
      }),

        updateQuantity: (id, quantity) => set((state) => {
          if (quantity < 1) return state;
          const newItems = state.items.map((item) =>
            item.id === id ? { ...item, quantity } : item
          );
          return {
            items: newItems,
            total: newItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
          };
        }),

        clearCart: () => set({ items: [], total: 0 }),
      }),
      {
        name: 'cart-storage',
      }
    )
  );