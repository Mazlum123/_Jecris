import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { Library } from '../pages/Library';
import { api } from '../services/api';
import { useAuthStore } from '../store/authStore';
import { useNotificationStore } from '../store/useNotificationStore';

// Mocks
vi.mock('../services/api');
vi.mock('../store/authStore');
vi.mock('../store/useNotificationStore');

const mockPurchases = [
  {
    id: '1',
    book: {
      id: 'book1',
      title: 'Test Book 1',
      description: 'Description test 1',
      imageUrl: 'test1.jpg',
      pdfUrl: 'test1.pdf'
    },
    purchaseDate: '2024-01-01T00:00:00.000Z'
  },
  {
    id: '2',
    book: {
      id: 'book2',
      title: 'Test Book 2',
      description: 'Description test 2',
      imageUrl: 'test2.jpg',
      pdfUrl: 'test2.pdf'
    },
    purchaseDate: '2024-01-02T00:00:00.000Z'
  }
];

const renderWithRouter = (component: React.ReactElement) => {
  return render(
    <BrowserRouter>
      {component}
    </BrowserRouter>
  );
};

describe('Library Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    (useAuthStore as any).mockReturnValue({
      isAuthenticated: true
    });
    (useNotificationStore as any).mockReturnValue({
      addNotification: vi.fn()
    });
  });

  it('affiche le chargement initialement', () => {
    (api.get as any).mockImplementationOnce(() => new Promise(() => {}));
    renderWithRouter(<Library />);
    expect(screen.getByText(/chargement/i)).toBeInTheDocument();
  });

  it('affiche les livres achetés', async () => {
    (api.get as any).mockResolvedValueOnce({ data: { data: mockPurchases } });
    
    renderWithRouter(<Library />);

    await waitFor(() => {
      expect(screen.getByText('Test Book 1')).toBeInTheDocument();
      expect(screen.getByText('Test Book 2')).toBeInTheDocument();
    });
  });

  it('affiche le message de bibliothèque vide', async () => {
    (api.get as any).mockResolvedValueOnce({ data: { data: [] } });
    
    renderWithRouter(<Library />);

    await waitFor(() => {
      expect(screen.getByText(/bibliothèque est vide/i)).toBeInTheDocument();
    });
  });

  it('gère les erreurs de chargement', async () => {
    (api.get as any).mockRejectedValueOnce(new Error('Erreur test'));
    const addNotification = vi.fn();
    (useNotificationStore as any).mockReturnValue({ addNotification });
    
    renderWithRouter(<Library />);

    await waitFor(() => {
      expect(screen.getByText(/erreur/i)).toBeInTheDocument();
    });
  });
});