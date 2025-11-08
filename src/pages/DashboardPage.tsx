
import { useAuth } from '../contexts/AuthContext';
import { Link, Outlet, useLocation } from 'react-router-dom'; 

export default function DashboardPage() {
  const { logout, user } = useAuth(); 
  const location = useLocation(); 
  const isActive = (path: string) => location.pathname === path;

  return (
    <div
      className="min-h-screen" 
      style={{
        backgroundImage: "url('/images/background-image-filmes.jpg')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed', 
      }}
    >
      <div className="absolute inset-0 bg-black opacity-60 z-0"></div>
      <div className="absolute inset-0 z-0" 
           style={{ background: 'linear-gradient(to bottom, rgba(0,0,0,0) 0%, rgba(0,0,0,0.4) 100%)' }}>
      </div>

      
      <header className="bg-white/95 shadow-md sticky top-0 z-10 backdrop-blur-sm">
        <nav className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            
            
            <div className="flex items-center gap-6">
              <Link to="/dashboard" className="flex items-center gap-2">
                <svg className="w-8 h-8 text-indigo-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 20.25h12m-7.5-3v3m3-3v3m-1.5-12H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
                </svg>
                <span className="text-xl font-bold text-gray-900">CineBase</span>
              </Link>
              
              <div className="hidden md:flex gap-4">
                <Link 
                  to="/dashboard" 
                  className={`text-sm font-medium px-1 py-2 ${
                    isActive('/dashboard') 
                      ? 'border-b-2 border-indigo-500 text-gray-900' 
                      : 'border-b-2 border-transparent text-gray-500 hover:text-gray-900'
                  }`}
                >
                  Meus Filmes
                </Link>
                <Link 
                  to="/dashboard/add" 
                  className={`text-sm font-medium px-1 py-2 ${
                    isActive('/dashboard/add') 
                      ? 'border-b-2 border-indigo-500 text-gray-900' 
                      : 'border-b-2 border-transparent text-gray-500 hover:text-gray-900'
                  }`}
                >
                  Adicionar Filme
                </Link>
              </div>
            </div>

            
            <div className="flex items-center gap-4">
              <span className="hidden sm:block text-sm text-gray-700">
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
                <span className="hidden sm:block">Sair</span>
              </button>
            </div>

          </div>
        </nav>
      </header>

      
      <main className="relative z-1 max-w-5xl mx-auto mt-6 p-4">
        <Outlet />
      </main>

      
      <div className="h-20 relative z-1"></div> 
    </div>
  );
}