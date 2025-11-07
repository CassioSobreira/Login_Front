import {createBrowserRouter,RouterProvider,Navigate,Outlet, } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import NotFoundPage from './pages/NotFoundPage';

/**
 * Componente de Layout (similar ao seu exemplo com Navbar)
 * Inclui o Outlet, que é onde as rotas "filhas" (LoginPage, etc.) serão renderizadas.
 */
function RootLayout() {
  return (
    // Aplicando um estilo de fundo base, similar ao seu exemplo
    <div className="min-h-screen bg-gray-50 font-sans">
      {/* <Navbar /> -- Poderíamos adicionar um Navbar aqui no futuro */}
      <main>
        {/* As páginas (LoginPage, RegisterPage, etc.) serão renderizadas aqui */}
        <Outlet />
      </main>
    </div>
  );
}

/**
 * Definição das rotas usando a nova API createBrowserRouter
 */
const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />, // O RootLayout aplica-se a todas as rotas
    errorElement: <NotFoundPage />, // Página de erro global
    children: [
      // A rota "index" (/) redireciona para /login
      { index: true, element: <Navigate to="/login" replace /> },

      // Rotas Públicas
      { path: 'login', element: <LoginPage /> },
      { path: 'register', element: <RegisterPage /> },

      // Rota Privada (por agora)
      // NOTA: No próximo passo, vamos proteger esta rota.
      { path: 'dashboard', element: <DashboardPage /> },
    ],
  },
  // A rota 404 "*" é tratada pelo errorElement no router principal
]);

/**
 * Componente principal da aplicação
 */
function App() {
  return (
    <>
      {/* O ToastContainer permite que as notificações apareçam em qualquer lugar */}
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

      {/* O RouterProvider injeta as rotas na nossa aplicação */}
      <RouterProvider router={router} />
    </>
  );
}

export default App;