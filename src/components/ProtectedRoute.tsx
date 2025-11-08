import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Navigate, Outlet } from 'react-router-dom';

export default function ProtectedRoute() {

  const { isAuthenticated, initialLoading } = useAuth();

  if (initialLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-gray-600 text-lg">Carregando...</p>
      </div>
    );
  }

  if (!isAuthenticated) {

    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}