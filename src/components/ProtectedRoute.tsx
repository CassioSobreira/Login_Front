import React from 'react';
import { useAuth } from '../contexts/AuthContext'; // Usa o contexto
import { Navigate, Outlet } from 'react-router-dom';

export default function ProtectedRoute() {
  const { isAuthenticated, initialLoading } = useAuth(); // Usa o 'initialLoading'

  // 1. Mostra 'Carregando...' enquanto o AuthContext
  //    verifica o localStorage (MUITO IMPORTANTE)
  if (initialLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-gray-600 text-lg">Carregando...</p>
      </div>
    );
  }

  // 2. Só depois de carregar, verifica se está autenticado
  if (!isAuthenticated) {
    // Se não estiver, redireciona para o login
    return <Navigate to="/login" replace />;
  }

  // 3. Se estiver autenticado, mostra a página (Dashboard)
  // O <Outlet> renderiza a rota filha (ex: <DashboardPage />)
  return <Outlet />;
}