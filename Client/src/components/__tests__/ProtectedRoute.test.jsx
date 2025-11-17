import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { BrowserRouter, Routes, Route, MemoryRouter } from 'react-router-dom';

vi.mock('../../context/AuthContext', () => ({
  useAuth: vi.fn(),
}));

import ProtectedRoute from '../ProtectedRoute';
import { useAuth } from '../../context/AuthContext';

describe('ProtectedRoute', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const renderWithRouter = (component, initialRoute = '/') => {
    return render(
      <MemoryRouter initialEntries={[initialRoute]}>
        <Routes>
          <Route path="/" element={component}>
            <Route index element={<div>Protected Content</div>} />
          </Route>
          <Route path="/login" element={<div>Login Page</div>} />
        </Routes>
      </MemoryRouter>
    );
  };

  it('should show loading spinner when auth is loading', () => {
    useAuth.mockReturnValue({
      loading: true,
      token: null,
    });

    renderWithRouter(<ProtectedRoute />);

    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });

  it('should redirect to login when not authenticated', () => {
    useAuth.mockReturnValue({
      loading: false,
      token: null,
    });

    renderWithRouter(<ProtectedRoute />);

    expect(screen.getByText('Login Page')).toBeInTheDocument();
  });

  it('should render protected content when authenticated', () => {
    useAuth.mockReturnValue({
      loading: false,
      token: 'valid-token',
    });

    renderWithRouter(<ProtectedRoute />);

    expect(screen.getByText('Protected Content')).toBeInTheDocument();
  });
});
