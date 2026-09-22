import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export default function ProtectedRoute({ children, allowedRoles }) {
  const { currentUser, activeRole } = useAuth();

  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(activeRole)) {
    // Redirect to user's appropriate default dashboard
    if (activeRole === 'ASHA') return <Navigate to="/asha" replace />;
    if (activeRole === 'DOCTOR') return <Navigate to="/doctor" replace />;
    if (activeRole === 'ADMIN') return <Navigate to="/admin" replace />;
    return <Navigate to="/patient" replace />;
  }

  return children;
}
