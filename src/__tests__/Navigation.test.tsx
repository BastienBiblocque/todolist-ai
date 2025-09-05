import { render, screen, fireEvent } from '@testing-library/react';
import { useRouter } from 'next/navigation';
import Navigation from '../components/Navigation';

// Mock next/navigation
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
  usePathname: jest.fn(() => '/'),
}));

describe('Navigation', () => {
  const mockRouter = {
    push: jest.fn(),
    refresh: jest.fn(),
  };

  beforeEach(() => {
    // Reset mocks
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue(mockRouter);
  });

  it('renders logo and links', () => {
    render(<Navigation />);
    expect(screen.getByText('TodoList')).toBeInTheDocument();
    expect(screen.getByText('Accueil')).toBeInTheDocument();
  });

  it('shows login and register buttons when not authenticated', () => {
    Object.defineProperty(document, 'cookie', {
      writable: true,
      value: '',
    });

    render(<Navigation />);
    expect(screen.getByText('Connexion')).toBeInTheDocument();
    expect(screen.getByText('Inscription')).toBeInTheDocument();
    expect(screen.queryByText('Déconnexion')).not.toBeInTheDocument();
  });

  it('shows logout button when authenticated', () => {
    Object.defineProperty(document, 'cookie', {
      writable: true,
      value: 'authToken=testtoken',
    });

    render(<Navigation />);
    expect(screen.getByText('Déconnexion')).toBeInTheDocument();
    expect(screen.queryByText('Connexion')).not.toBeInTheDocument();
    expect(screen.queryByText('Inscription')).not.toBeInTheDocument();
  });

  it('handles logout correctly', async () => {
    global.fetch = jest.fn().mockResolvedValueOnce({});
    Object.defineProperty(document, 'cookie', {
      writable: true,
      value: 'authToken=testtoken',
    });

    render(<Navigation />);
    const logoutButton = screen.getByText('Déconnexion');
    await fireEvent.click(logoutButton);

    expect(global.fetch).toHaveBeenCalledWith('/api/auth/logout', {
      method: 'POST',
    });
    expect(mockRouter.push).toHaveBeenCalledWith('/login');
    expect(mockRouter.refresh).toHaveBeenCalled();
  });
});
