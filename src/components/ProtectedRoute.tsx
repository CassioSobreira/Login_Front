import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Navigate, Outlet } from 'react-router-dom';

/**
 * Este componente verifica se o utilizador está autenticado.
 * Se estiver, renderiza as rotas filhas (ex: <DashboardPage />) através do <Outlet />.
 * Se NÃO estiver, redireciona o utilizador para a página de login.
 */
export default function ProtectedRoute() {
  // Acedemos ao estado de autenticação do nosso contexto
  // 'initialLoading' é o estado que verifica o localStorage
  const { isAuthenticated, initialLoading } = useAuth();

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
    // 'replace' substitui a entrada no histórico de navegação
    return <Navigate to="/login" replace />;
  }

  // 3. Se estiver autenticado, renderiza a página que ele tentou aceder
  // O <Outlet> renderiza a rota filha (ex: <DashboardPage />)
  return <Outlet />;
}