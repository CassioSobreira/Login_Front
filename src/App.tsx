import React from 'react';
import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
  Outlet,
} from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
// (O CSS do Toastify deve estar no main.tsx)

import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import NotFoundPage from './pages/NotFoundPage';

// Importa o AuthProvider e o novo ProtectedRoute
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute'; // O nosso "segurança"

/**
 * Layout base da aplicação
 */
function RootLayout() {
  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <main>
        <Outlet />
      </main>
    </div>
  );
}

/**
 * Define as rotas principais
 */
const router = createBrowserRouter([
  {
    path: '/',
    element: (
      // O AuthProvider "embrulha" (wraps) o RootLayout
      // para que todas as páginas tenham acesso ao 'useAuth()'
      <AuthProvider>
        <RootLayout />
      </AuthProvider>
    ),
    errorElement: <NotFoundPage />,
    children: [
      // Rotas filhas do RootLayout
      { index: true, element: <Navigate to="/login" replace /> },
      
      // Rotas Públicas
      { path: 'login', element: <LoginPage /> },
      { path: 'register', element: <RegisterPage /> },
      
      // Rotas Privadas (agora protegidas)
      {
        element: <ProtectedRoute />, // O "segurança" fica aqui
        children: [
          // Todas as rotas aqui dentro exigem login
          { path: 'dashboard', element: <DashboardPage /> },
          // { path: 'profile', element: <ProfilePage /> } // Exemplo
        ],
      },
    ],
  },
]);

/**
 * App principal
 */
function App() {
  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
      <RouterProvider router={router} />
    </>
  );
}

export default App;