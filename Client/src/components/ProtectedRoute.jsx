import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Navigate, Outlet } from 'react-router-dom';

function ProtectedRoute() {
    const auth = useAuth();

    if (!auth.token) {
        // Dacă nu e logat, trimite-l la pagina de login
        return <Navigate to="/login" replace />;
    }

    // Dacă e logat, arată conținutul (paginile protejate)
    return <Outlet />;
}

export default ProtectedRoute;