
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
import MovieList from './pages/MovieList';
import AddMoviePage from './pages/AddMoviePage'; // (Verifique o caminho/nome da pasta se necessário)

// Importa o AuthProvider (do seu ficheiro AuthContext.tsx)
import { AuthProvider } from './contexts/AuthContext'; 
// Importa o SEU ProtectedRoute.tsx (que está correto)
import ProtectedRoute from './components/ProtectedRoute'; 

/**
 * Layout base da aplicação
 * (AuthProvider deve "embrulhar" este layout)
 */
function RootLayout() {
  return (
    // O AuthProvider "embrulha" (wraps) o RootLayout
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

// A função 'PrivateRoute' que estava aqui foi REMOVIDA
// porque agora está em 'src/components/ProtectedRoute.tsx'

/**
 * Define as rotas principais
 */
const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />, // O RootLayout (que contém o AuthProvider) é o elemento pai
    errorElement: <NotFoundPage />,
    children: [
      { index: true, element: <Navigate to="/login" replace /> },
      
      // Rotas Públicas (filhas diretas do RootLayout)
      { path: 'login', element: <LoginPage /> },
      { path: 'register', element: <RegisterPage /> },
      
      // --- CORREÇÃO AQUI ---
      // Rotas Privadas (agora filhas do ProtectedRoute)
      {
        element: <ProtectedRoute />, // O "segurança" fica aqui
        children: [
          // Todas as rotas aqui dentro exigem login e serão renderizadas pelo <Outlet> do ProtectedRoute
          {
            path: 'dashboard',
            element: <DashboardPage />, // O Layout (Navbar + Fundo + Outlet)
            // Rotas filhas do Dashboard (Meus Filmes, Adicionar Filme)
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
          },
          // { path: 'profile', element: <ProfilePage /> } // Exemplo de outra rota protegida
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