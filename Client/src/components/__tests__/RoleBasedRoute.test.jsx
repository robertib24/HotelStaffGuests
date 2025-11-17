import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import RoleBasedRoute from '../RoleBasedRoute';

vi.mock('../../context/AuthContext', () => ({
  useAuth: vi.fn(),
}));

import { useAuth } from '../../context/AuthContext';

describe('RoleBasedRoute', () => {
  const renderWithRouter = (component, allowedRoles) => {
    return render(
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<RoleBasedRoute allowedRoles={allowedRoles} />}>
            <Route index element={<div>Protected Content</div>} />
          </Route>
          <Route path="/login" element={<div>Login Page</div>} />
          <Route path="/reservations" element={<div>Reservations Page</div>} />
        </Routes>
      </BrowserRouter>
    );
  };

  it('should redirect to login when user is not authenticated', () => {
    useAuth.mockReturnValue({
      user: null,
    });

    renderWithRouter(<RoleBasedRoute />, ['ROLE_ADMIN']);

    expect(screen.getByText('Login Page')).toBeInTheDocument();
  });

  it('should render content when user has allowed role', () => {
    useAuth.mockReturnValue({
      user: { role: 'ROLE_ADMIN' },
    });

    renderWithRouter(<RoleBasedRoute />, ['ROLE_ADMIN']);

    expect(screen.getByText('Protected Content')).toBeInTheDocument();
  });

  it('should redirect to reservations when user role is not allowed', () => {
    useAuth.mockReturnValue({
      user: { role: 'ROLE_RECEPTIONIST' },
    });

    renderWithRouter(<RoleBasedRoute />, ['ROLE_ADMIN']);

    expect(screen.getByText('Reservations Page')).toBeInTheDocument();
  });

  it('should allow access for multiple allowed roles', () => {
    useAuth.mockReturnValue({
      user: { role: 'ROLE_MANAGER' },
    });

    renderWithRouter(<RoleBasedRoute />, ['ROLE_ADMIN', 'ROLE_MANAGER']);

    expect(screen.getByText('Protected Content')).toBeInTheDocument();
  });
});
