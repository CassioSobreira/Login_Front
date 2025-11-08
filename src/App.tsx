import React from 'react';
import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
  Outlet,
} from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage'; 
import NotFoundPage from './pages/NotFoundPage';
import MovieList from './pages/MovieList';
import AddMoviePage from './pages/AddMoviePage'; 
import { AuthProvider, useAuth } from './contexts/AuthContext'; 
import ProtectedRoute from './components/ProtectedRoute';


function RootLayout() {
  return (
    
    <AuthProvider>
      <div className="min-h-screen bg-gray-50 font-sans">
        <main>
          <Outlet />
        </main>
      </div>
    </AuthProvider>
  );
}


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
  
  return <Outlet />; 
}

const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />, 
    errorElement: <NotFoundPage />,
    children: [
      { index: true, element: <Navigate to="/login" replace /> },
      
      
      { path: 'login', element: <LoginPage /> },
      { path: 'register', element: <RegisterPage /> },
      
      {
        element: <ProtectedRoute />, 
        children: [
          
          {
            path: 'dashboard',
            element: <DashboardPage />, 
            
            
            children: [
              { 
                index: true, 
                element: <MovieList /> 
              }, 
              { 
                path: 'add', 
                element: <AddMoviePage /> 
              }
            ]
            
          },
          
        ],
      },
    ],
  },
]);

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