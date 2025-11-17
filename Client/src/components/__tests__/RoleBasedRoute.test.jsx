import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MemoryRouter, Routes, Route } from 'react-router-dom';

vi.mock('../../context/AuthContext', () => ({
  useAuth: vi.fn(),
}));

import RoleBasedRoute from '../RoleBasedRoute';
import { useAuth } from '../../context/AuthContext';

describe('RoleBasedRoute', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const renderWithRouter = (allowedRoles) => {
    return render(
      <MemoryRouter initialEntries={['/']}>
        <Routes>
          <Route path="/" element={<RoleBasedRoute allowedRoles={allowedRoles} />}>
            <Route index element={<div>Protected Content</div>} />
          </Route>
          <Route path="/login" element={<div>Login Page</div>} />
          <Route path="/reservations" element={<div>Reservations Page</div>} />
        </Routes>
      </MemoryRouter>
    );
  };

  it('should redirect to login when user is not authenticated', () => {
    useAuth.mockReturnValue({
      user: null,
    });

    renderWithRouter(['ROLE_ADMIN']);

    expect(screen.getByText('Login Page')).toBeInTheDocument();
  });

  it('should render content when user has allowed role', () => {
    useAuth.mockReturnValue({
      user: { role: 'ROLE_ADMIN' },
    });

    renderWithRouter(['ROLE_ADMIN']);

    expect(screen.getByText('Protected Content')).toBeInTheDocument();
  });

  it('should redirect to reservations when user role is not allowed', () => {
    useAuth.mockReturnValue({
      user: { role: 'ROLE_RECEPTIONIST' },
    });

    renderWithRouter(['ROLE_ADMIN']);

    expect(screen.getByText('Reservations Page')).toBeInTheDocument();
  });

  it('should allow access for multiple allowed roles', () => {
    useAuth.mockReturnValue({
      user: { role: 'ROLE_MANAGER' },
    });

    renderWithRouter(['ROLE_ADMIN', 'ROLE_MANAGER']);

    expect(screen.getByText('Protected Content')).toBeInTheDocument();
  });
});
