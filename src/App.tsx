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
import DashboardPage from './pages/DashboardPage'; // O Layout
import NotFoundPage from './pages/NotFoundPage';

// 1. IMPORTAR AS NOVAS PÁGINAS FILHAS
import MovieList from './pages/MovieList';
import AddMoviePage from './pages/AddMoviePage'; // (Verifique o nome desta pasta)

// Importa o AuthProvider e o PrivateRoute
// (Assumindo que estão em 'src/contexts/' e 'src/components/')
import { AuthProvider, useAuth } from './contexts/AuthContext'; 
import ProtectedRoute from './components/ProtectedRoute';


/**
 * Layout base da aplicação
 */
function RootLayout() {
  return (
    // O AuthProvider DEVE "embrulhar" (wrap) o RootLayout
    // para que todas as páginas tenham acesso ao 'useAuth()'
    <AuthProvider>
      <div className="min-h-screen bg-gray-50 font-sans">
        <main>
          {/* As páginas (LoginPage, DashboardPage, etc.) 
              serão renderizadas aqui */}
          <Outlet />
        </main>
      </div>
    </AuthProvider>
  );
}

/**
 * Rota protegida (O seu "segurança")
 */
function PrivateRoute() { 
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
  
  return <Outlet />; // Renderiza as rotas filhas (DashboardPage)
}

/**
 * Define as rotas principais
 */
const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />, // O RootLayout agora contém o AuthProvider
    errorElement: <NotFoundPage />,
    children: [
      { index: true, element: <Navigate to="/login" replace /> },
      
      // Rotas Públicas
      { path: 'login', element: <LoginPage /> },
      { path: 'register', element: <RegisterPage /> },
      
      // --- ROTAS PROTEGIDAS (CORRIGIDAS) ---
      {
        element: <ProtectedRoute />, // O "segurança"
        children: [
          // O segurança protege tudo aqui dentro
          {
            path: 'dashboard',
            element: <DashboardPage />, // O Layout (Navbar + Fundo + Outlet)
            
            // --- CORREÇÃO AQUI ---
            // Rotas filhas que serão renderizadas DENTRO do <Outlet> do DashboardPage
            children: [
              { 
                index: true, // A rota /dashboard (index) mostra a lista
                element: <MovieList /> 
              }, 
              { 
                path: 'add', // A rota /dashboard/add mostra o formulário
                element: <AddMoviePage /> 
              }
            ]
            // --- FIM DA CORREÇÃO ---
          },
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