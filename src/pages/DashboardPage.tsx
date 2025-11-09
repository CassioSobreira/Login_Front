import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Link, Outlet, useLocation } from 'react-router-dom';

export default function DashboardPage() {
  const { logout, user } = useAuth();
  const location = useLocation();
  const isActive = (path: string) => location.pathname === path;

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div
      className="
        min-h-screen 
        bg-cover 
        bg-center 
        bg-fixed
        bg-[url('/images/background-image-filmes-mobile.jpg')]
        md:bg-[url('/images/background-image-filmes-tablet.jpg')]
        lg:bg-[url('/images/background-image-filmes.jpg')]
      "
      
    >
      <div className="absolute inset-0 bg-black opacity-60 z-0"></div>
      <div className="absolute inset-0 z-0"
        style={{ background: 'linear-gradient(to bottom, rgba(0,0,0,0) 0%, rgba(0,0,0,0.4) 100%)' }}>
      </div>

      
      <header className="bg-white/95 shadow-md sticky top-0 z-10 backdrop-blur-sm">
        <nav className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">

            
            <div className="flex items-center gap-6">
              
              <Link to="/dashboard" className="flex items-center gap-2 flex-shrink-0">
                <svg className="w-8 h-8 text-indigo-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 20.25h12m-7.5-3v3m3-3v3m-1.5-12H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
                </svg>
                <span className="text-xl font-bold text-gray-900">CineBase</span>
              </Link>

              
              <div className="hidden md:flex gap-4">
                <Link
                  to="/dashboard"
                  className={`text-sm font-medium px-1 py-2 ${isActive('/dashboard')
                      ? 'border-b-2 border-indigo-500 text-gray-900'
                      : 'border-b-2 border-transparent text-gray-500 hover:text-gray-900'
                    }`}
                >
                  Meus Filmes
                </Link>
                <Link
                  to="/dashboard/add"
                  className={`text-sm font-medium px-1 py-2 ${isActive('/dashboard/add')
                      ? 'border-b-2 border-indigo-500 text-gray-900'
                      : 'border-b-2 border-transparent text-gray-500 hover:text-gray-900'
                    }`}
                >
                  Adicionar Filme
                </Link>
              </div>
            </div>

            
            <div className="flex items-center gap-4">
              
              <div className="hidden md:flex items-center gap-4">
                <span className="text-sm text-gray-700">
                  Olá, {user?.name || 'Usuário'}
                </span>
                <button
                  onClick={logout}
                  className="flex items-center gap-1.5 text-sm font-medium text-gray-600 hover:text-red-600 transition-colors"
                  title="Sair"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15M12 9l-3 3m0 0 3 3m-3-3h12.75" />
                  </svg>
                  <span>Sair</span>
                </button>
              </div>

              
              <div className="md:hidden">
                <button
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                  className="text-gray-700 hover:text-indigo-600 p-2 rounded-md"
                  aria-label="Abrir menu principal"
                >
                  
                  {isMobileMenuOpen ? (
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                    </svg>
                  )}
                </button>
              </div>

            </div>
          </div>
        </nav>

        
        {isMobileMenuOpen && (
          <div className="md:hidden bg-white shadow-lg">
            
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              <Link
                to="/dashboard"
                onClick={() => setIsMobileMenuOpen(false)} 
                className={`block px-3 py-2 rounded-md text-base font-medium ${isActive('/dashboard') ? 'bg-indigo-50 text-indigo-700' : 'text-gray-700 hover:bg-gray-50'
                  }`}
              >
                Meus Filmes
              </Link>
              <Link
                to="/dashboard/add"
                onClick={() => setIsMobileMenuOpen(false)} 
                className={`block px-3 py-2 rounded-md text-base font-medium ${isActive('/dashboard/add') ? 'bg-indigo-50 text-indigo-700' : 'text-gray-700 hover:bg-gray-50'
                  }`}
              >
                Adicionar Filme
              </Link>
            </div>
            
            
            <div className="border-t border-gray-200 pt-4 pb-3">
              <div className="flex items-center px-4">
                <span className="text-base font-medium text-gray-800">
                  Olá, {user?.name || 'Usuário'}
                </span>
              </div>
              <div className="mt-3 px-2 space-y-1">
                <button
                  onClick={() => {
                    logout();
                    setIsMobileMenuOpen(false); 
                  }}
                  className="w-full text-left flex items-center gap-2 px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-50"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15M12 9l-3 3m0 0 3 3m-3-3h12.75" />
                  </svg>
                  Sair
                </button>
              </div>
            </div>
          </div>
        )}
      </header>

      
      <main className="relative z-1 max-w-5xl mx-auto mt-6 p-4">
        <Outlet />
      </main>

      <div className="h-20 relative z-1"></div>
    </div>
  );
}