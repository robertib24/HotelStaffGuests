import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Navigate, Outlet } from 'react-router-dom';

function RoleBasedRoute({ allowedRoles }) {
    const { user } = useAuth();

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    const isAllowed = allowedRoles.includes(user.role);

    if (!isAllowed) {
        return <Navigate to="/reservations" replace />;
    }

    return <Outlet />;
}

export default RoleBasedRoute;