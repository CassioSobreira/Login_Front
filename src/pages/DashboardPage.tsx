import React, { useState, useEffect } from 'react'; // 1. Importar useEffect
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'react-toastify';

// Interface do Filme (DEVE ser igual à do seu backend)
interface IMovie {
  id: string | number;
  title: string;
  director?: string;
  year?: number;
  genre?: string;
  rating?: number;
}

export default function DashboardPage() {
  // 2. Usar o 'api' e 'loading' global
  const { logout, user, api, loading } = useAuth();
  
  // 3. Iniciar o estado de filmes como um array vazio
  const [movies, setMovies] = useState<IMovie[]>([]);
  
  const [newMovieTitle, setNewMovieTitle] = useState('');
  // O 'loading' local foi removido, usamos o global do contexto

  // 4. Função para buscar filmes REAIS
  const fetchMovies = async () => {
    console.log('Buscando filmes da API...');
    // A função 'api' já inclui o token
    const data = await api<IMovie[]>('GET', '/movies');
    if (data) {
      setMovies(data);
    }
  };

  // 5. useEffect para buscar filmes quando a página carregar
  useEffect(() => {
    fetchMovies();
    // AVISO: Adicionar 'api' ao array de dependências pode causar loops
    // se a instância de 'api' mudar. Mas no nosso AuthContext, ela é estável.
    // A forma mais segura (se 'api' não estiver otimizada com useCallback)
    // é desativar o lint para esta linha:
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // [] = Executar apenas uma vez quando o componente montar

  // 6. Atualizar handleCreateMovie para usar a API
  const handleCreateMovie = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newMovieTitle.trim()) {
      // (Pode adicionar mais campos do formulário aqui, ex: director, year)
      const data = await api<IMovie>('POST', '/movies', { title: newMovieTitle });
      
      if (data) {
        toast.success(`Filme "${data.title}" criado!`);
        // Adiciona o novo filme (da resposta da API) ao estado local
        setMovies([...movies, data]);
        setNewMovieTitle('');
      }
    }
  };

  // 7. Atualizar handleDeleteMovie para usar a API
  const handleDeleteMovie = async (id: string | number) => {
    if (window.confirm('Tem certeza que deseja apagar este filme?')) {
      // Chama a API (método DELETE não retorna 'body', data será null se ok)
      const data = await api('DELETE', `/movies/${id}`);
      
      if (data === null) { // Sucesso (204 No Content ou 401/403 já tratados)
        toast.success('Filme apagado com sucesso.');
        // Remove o filme do estado local para atualizar a UI
        setMovies(movies.filter((movie) => movie.id !== id));
      }
    }
  };

  return (
    <div
      className="min-h-screen"
      style={{
        backgroundImage: "url('/images/background-image-filmes.jpg')", // (Ajuste o caminho se necessário)
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <div className="absolute inset-0 bg-black opacity-60 z-0"></div>

      <header className="bg-white/90 shadow-md sticky top-0 z-10 backdrop-blur-sm">
        <nav className="max-w-5xl mx-auto px-4 flex justify-between items-center h-16">
          <h1 className="text-2xl font-bold text-gray-800">
            {/* 8. Usa o 'user' do contexto */}
            Olá, {user?.name || 'Usuário'}
          </h1>
          <button
            onClick={logout} // 9. Usa o 'logout' do contexto
            className="py-2 px-4 rounded-md text-sm font-medium text-white bg-red-600 hover:bg-red-700"
          >
            Logout
          </button>
        </nav>
      </header>

      <main className="relative z-1 max-w-5xl mx-auto mt-6 p-4">
        <div className="bg-white shadow rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">
            Adicionar Novo Filme
          </h2>
          <form onSubmit={handleCreateMovie} className="flex flex-col sm:flex-row gap-4">
            <input
              type="text"
              value={newMovieTitle}
              onChange={(e) => setNewMovieTitle(e.target.value)}
              placeholder="Título do Filme"
              className="flex-grow px-4 py-2 border rounded-md"
              disabled={loading} // 10. Usa o loading global
            />
            <button
              type="submit"
              disabled={loading} // 10. Usa o loading global
              className="py-2 px-5 rounded-md text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-400"
            >
              {loading ? 'Salvando...' : 'Adicionar'}
            </button>
          </form>
        </div>

        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">Seus Filmes</h2>
          {/* 11. Mostra 'Carregando...' se 'loading' for true E o array estiver vazio */}
          {loading && movies.length === 0 && (
             <p className="text-gray-500 text-center">Carregando filmes...</p>
          )}
          
          {!loading && movies.length === 0 && (
             <p className="text-gray-500 text-center">Nenhum filme adicionado.</p>
          )}
          
          <ul className="space-y-4">
            {movies.length > 0 &&
              movies.map((movie) => (
                <li
                  key={movie.id}
                  className="flex justify-between items-center p-4 bg-gray-50 rounded-md border hover:bg-gray-100"
                >
                  <span className="text-lg text-gray-900">{movie.title}</span>
                  <button
                    onClick={() => handleDeleteMovie(movie.id)}
                    disabled={loading} // Desativa o botão de apagar durante C/R/U
                    className="text-red-500 hover:text-red-700 disabled:text-gray-300"
                  >
                    Apagar
                  </button>
                </li>
              ))
            }
          </ul>
        </div>
      </main>
    </div>
  );
}