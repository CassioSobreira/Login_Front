import React, { useState } from 'react';


interface IMovie {
  id: string | number;
  title: string;
  year?: number;
}

export default function DashboardPage() {
  const loading = false; 
  const [movies, setMovies] = useState<IMovie[]>([
    { id: 1, title: 'Filme de Exemplo 1 (Falso)', year: 2023 },
    { id: 2, title: 'Filme de Exemplo 2 (Falso)', year: 2024 },
  ]);
  const [newMovieTitle, setNewMovieTitle] = useState('');

  const handleLogout = () => {
    console.log('Ação de Logout (apenas design)');
  };

  const handleCreateMovie = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Criar filme (apenas design):', newMovieTitle);
    
    if (newMovieTitle.trim()) {
      setMovies([
        ...movies,
        { id: Math.random(), title: newMovieTitle || 'Filme Sem Título (Falso)' },
      ]);
      setNewMovieTitle('');
    }
  };

  const handleDeleteMovie = (id: string | number) => {
    console.log('Apagar filme (apenas design):', id);
    setMovies(movies.filter((movie) => movie.id !== id));
  };

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

      <header className="bg-white/90 shadow-md sticky top-0 z-10 backdrop-blur-sm">
        <nav className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <h1 className="text-2xl font-bold text-gray-800">
              Minha Lista de Filmes
            </h1>
            <button
              onClick={handleLogout}
              className="py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors"
            >
              Logout
            </button>
          </div>
        </nav>
      </header>

      <main className="relative z-1 max-w-5xl mx-auto mt-6 p-4 sm:px-6 lg:px-8">
        
        <div className="bg-white shadow rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">Adicionar Novo Filme</h2>
          <form onSubmit={handleCreateMovie} className="flex flex-col sm:flex-row gap-4">
            <input
              type="text"
              value={newMovieTitle}
              onChange={(e) => setNewMovieTitle(e.target.value)}
              placeholder="Título do Filme (Ex: Duna: Parte 2)"
              className="flex-grow block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
            <button
              type="submit"
              disabled={loading}
              className="py-2 px-5 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-gray-400 transition-colors"
            >
              {loading ? 'A adicionar...' : 'Adicionar'}
            </button>
          </form>
        </div>

        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">Seus Filmes</h2>
          {loading && movies.length === 0 ? (
            <p className="text-gray-500">A carregar filmes...</p>
          ) : (
            <ul className="space-y-4">
              {movies.length > 0 ? (
                movies.map((movie) => (
                  <li
                    key={movie.id}
                    className="flex justify-between items-center p-4 bg-gray-50 rounded-md border hover:bg-gray-100 transition-colors"
                  >
                    <div>
                      <span className="font-medium text-lg text-gray-900">{movie.title}</span>
                      {movie.year && (
                        <span className="text-sm text-gray-500 ml-2">
                          ({movie.year})
                        </span>
                      )}
                    </div>
                    <button
                      onClick={() => handleDeleteMovie(movie.id)}
                      disabled={loading}
                      className="text-red-500 hover:text-red-700 text-sm font-medium disabled:text-gray-400 transition-colors"
                    >
                      Apagar
                    </button>
                  </li>
                ))
              ) : (
                <p className="text-gray-500 text-center py-4">
                  Você ainda não adicionou nenhum filme.
                </p>
              )}
            </ul>
          )}
        </div>
      </main>

      <div className="h-20 relative z-1"></div> 
    </div>
  );
}