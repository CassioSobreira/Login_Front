import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom'; // Importar o Link

// Interface do Filme
interface IMovie {
  id: number;
  title: string;
  director?: string | null;
  year?: number | null;
  genre?: string | null;
  rating?: number | null;
}

// Tipo para os dados do formulário
interface MovieFormData {
  title: string;
  director: string;
  year: string;
  genre: string;
  rating: string;
}

export default function DashboardPage() {
  const { logout, user, api, loading } = useAuth(); 
  const [movies, setMovies] = useState<IMovie[]>([]);
  
  // Estado para o formulário de CRIAÇÃO
  const [newMovie, setNewMovie] = useState<MovieFormData>({
    title: '', director: '', year: '', genre: '', rating: ''
  });

  // --- Estados para o Modal de ATUALIZAÇÃO ---
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentMovie, setCurrentMovie] = useState<IMovie | null>(null);
  const [editFormData, setEditFormData] = useState<MovieFormData>({
    title: '', director: '', year: '', genre: '', rating: ''
  });
  // ------------------------------------------

  // Função para buscar filmes REAIS
  const fetchMovies = async () => {
    console.log('Buscando filmes da API...');
    const data = await api<IMovie[]>('GET', '/movies');
    if (data) {
      setMovies(data);
    }
  };

  // Buscar filmes QUANDO a página carregar
  useEffect(() => {
    fetchMovies();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // [] = Executar apenas uma vez

  // Limpa o formulário de criação
  const clearCreateForm = () => {
    setNewMovie({ title: '', director: '', year: '', genre: '', rating: '' });
  };

  // --- Lógica do CRUD ---

  const handleCreateMovie = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMovie.title.trim()) {
      toast.warn('O título é obrigatório.');
      return;
    }

    const movieData = {
      title: newMovie.title,
      director: newMovie.director || undefined,
      genre: newMovie.genre || undefined,
      year: newMovie.year ? parseInt(newMovie.year, 10) : undefined,
      rating: newMovie.rating ? parseInt(newMovie.rating, 10) : undefined,
    };

    // Espera a resposta completa (que inclui a 'movie')
    const data = await api<{ message: string, movie: IMovie }>('POST', '/movies', movieData);
      
    if (data && data.movie) { 
      toast.success('Novo filme adicionado à sua lista!'); 
      setMovies([...movies, data.movie]); 
      clearCreateForm(); 
    }
  };

  const handleDeleteMovie = async (id: number) => {
    if (window.confirm('Tem certeza que deseja apagar este filme?')) {
      const data = await api('DELETE', `/movies/${id}`);
      if (data) { 
        toast.success('Filme apagado com sucesso.');
        setMovies(movies.filter((movie) => movie.id !== id));
      }
    }
  };

  // --- Lógica do Modal de ATUALIZAÇÃO ---

  const handleOpenEditModal = (movie: IMovie) => {
    setCurrentMovie(movie); 
    setEditFormData({
      title: movie.title || '',
      director: movie.director || '',
      year: movie.year?.toString() || '',
      genre: movie.genre || '',
      rating: movie.rating?.toString() || '',
    });
    setIsModalOpen(true); 
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setCurrentMovie(null);
    setEditFormData({ title: '', director: '', year: '', genre: '', rating: '' });
  };
  
  const handleEditFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
     setEditFormData({
        ...editFormData,
        [e.target.name]: e.target.value
     });
  };

  const handleUpdateMovie = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentMovie) return; 

    if (!editFormData.title.trim()) {
      toast.warn('O título é obrigatório.');
      return;
    }

    const updatedData = {
      title: editFormData.title,
      director: editFormData.director || undefined,
      genre: editFormData.genre || undefined,
      year: editFormData.year ? parseInt(editFormData.year, 10) : undefined,
      rating: editFormData.rating ? parseInt(editFormData.rating, 10) : undefined,
    };

    // Espera a resposta completa (que inclui a 'movie')
    const data = await api<{ message: string, movie: IMovie }>('PATCH', `/movies/${currentMovie.id}`, updatedData);

    if (data && data.movie) {
      toast.success('Filme atualizado com sucesso!'); // Mensagem genérica
      setMovies(movies.map(movie => movie.id === data.movie.id ? data.movie : movie));
      handleCloseModal(); 
    }
  };


  return (
    <div
      className="min-h-screen" 
      style={{
        backgroundImage: "url('/images/background-image-filmes.jpg')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed', // <-- CORREÇÃO DO FUNDO
      }}
    >
      {/* Sobreposição escura */}
      <div className="absolute inset-0 bg-black opacity-60 z-0"></div>

      {/* Gradiente opcional para escurecer a parte de baixo (se necessário) */}
      <div className="absolute inset-0 z-0" 
           style={{ background: 'linear-gradient(to bottom, rgba(0,0,0,0) 0%, rgba(0,0,0,0.4) 100%)' }}>
      </div>

      {/* --- HEADER (NAVBAR) ATUALIZADA --- */}
      <header className="bg-white/95 shadow-md sticky top-0 z-10 backdrop-blur-sm">
        <nav className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            
            {/* Lado Esquerdo: Marca e Links de Navegação */}
            <div className="flex items-center gap-6">
              {/* Marca (Logo + Título) */}
              <Link to="/dashboard" className="flex items-center gap-2">
                {/* Ícone SVG de Rolo de Filme */}
                <svg className="w-8 h-8 text-indigo-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 20.25h12m-7.5-3v3m3-3v3m-1.5-12H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
                </svg>
                <span className="text-xl font-bold text-gray-900">CineBase</span>
              </Link>
              
              {/* Links de Navegação (escondido em telas pequenas) */}
              <div className="hidden md:flex">
                <Link 
                  to="/dashboard" 
                  className="border-b-2 border-indigo-500 text-sm font-medium text-gray-900 px-1 py-2"
                  aria-current="page" 
                >
                  Meus Filmes
                </Link>
              </div>
            </div>

            {/* Lado Direito: Utilizador e Logout */}
            <div className="flex items-center gap-4">
              <span className="hidden sm:block text-sm text-gray-700">
                Olá, {user?.name || 'Usuário'}
              </span>
              <button
                onClick={logout}
                className="flex items-center gap-1.5 text-sm font-medium text-gray-600 hover:text-red-600 transition-colors"
                title="Sair"
              >
                {/* Ícone SVG de Logout */}
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15M12 9l-3 3m0 0 3 3m-3-3h12.75" />
                </svg>
                <span className="hidden sm:block">Sair</span>
              </button>
            </div>

          </div>
        </nav>
      </header>
      {/* --- FIM DA HEADER --- */}


      {/* Conteúdo Principal (CRUD) */}
      <main className="relative z-1 max-w-5xl mx-auto mt-6 p-4">
        
        {/* Formulário de Criação (Completo) */}
        <div className="bg-white shadow rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">
            Adicionar Novo Filme
          </h2>
          <form onSubmit={handleCreateMovie} className="space-y-4">
            {/* Linha 1: Título */}
            <div>
              <label htmlFor="title-create" className="block text-sm font-medium text-gray-700">Título*</label>
              <input
                type="text" id="title-create" name="title"
                value={newMovie.title}
                onChange={(e) => setNewMovie({...newMovie, title: e.target.value})}
                placeholder="Ex: Duna: Parte 2"
                className="mt-1 flex-grow px-4 py-2 border rounded-md w-full"
                required disabled={loading}
              />
            </div>
            {/* Linha 2: Realizador e Género */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="director-create" className="block text-sm font-medium text-gray-700">Realizador</label>
                <input
                  type="text" id="director-create" name="director"
                  value={newMovie.director}
                  onChange={(e) => setNewMovie({...newMovie, director: e.target.value})}
                  placeholder="Ex: Denis Villeneuve"
                  className="mt-1 flex-grow px-4 py-2 border rounded-md w-full"
                  disabled={loading}
                />
              </div>
              <div>
                <label htmlFor="genre-create" className="block text-sm font-medium text-gray-700">Género</label>
                <input
                  type="text" id="genre-create" name="genre"
                  value={newMovie.genre}
                  onChange={(e) => setNewMovie({...newMovie, genre: e.target.value})}
                  placeholder="Ex: Ficção Científica"
                  className="mt-1 flex-grow px-4 py-2 border rounded-md w-full"
                  disabled={loading}
                />
              </div>
            </div>
            {/* Linha 3: Ano e Rating */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="year-create" className="block text-sm font-medium text-gray-700">Ano</label>
                <input
                  type="number" id="year-create" name="year"
                  value={newMovie.year}
                  onChange={(e) => setNewMovie({...newMovie, year: e.target.value})}
                  placeholder="Ex: 2024"
                  className="mt-1 flex-grow px-4 py-2 border rounded-md w-full"
                  disabled={loading}
                />
              </div>
              <div>
                <label htmlFor="rating-create" className="block text-sm font-medium text-gray-700">Rating (1-10)</label>
                <input
                  type="number" id="rating-create" name="rating"
                  value={newMovie.rating}
                  onChange={(e) => setNewMovie({...newMovie, rating: e.target.value})}
                  placeholder="Ex: 9"
                  min="1" max="10" step="1"
                  className="mt-1 flex-grow px-4 py-2 border rounded-md w-full"
                  disabled={loading}
                />
              </div>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full sm:w-auto py-2 px-6 rounded-md text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-400"
            >
              {loading ? 'Adicionando...' : 'Adicionar Filme'}
            </button>
          </form>
        </div>

        {/* Lista de Filmes (com 'key' e rating) */}
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">Seus Filmes</h2>
          {loading && movies.length === 0 && (
            <p className="text-gray-500 text-center">A carregar filmes...</p>
          )}
          {!loading && movies.length === 0 && (
            <p className="text-gray-500 text-center">Nenhum filme adicionado.</p>
          )}
          <ul className="space-y-4">
            {movies.length > 0 &&
              movies.map((movie) => (
                <li
                  key={movie.id} 
                  className="flex flex-col sm:flex-row sm:justify-between sm:items-center p-4 bg-gray-50 rounded-md border hover:bg-gray-100"
                >
                  {/* Informações do Filme */}
                  <div className="mb-4 sm:mb-0">
                    <div className="flex items-center gap-3">
                      <span className="font-medium text-lg text-gray-900">{movie.title}</span>
                      {movie.rating && (
                        <span className="flex items-center text-sm font-bold text-yellow-500 bg-yellow-100 px-2 py-0.5 rounded-full">
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 mr-1">
                            <path fillRule="evenodd" d="M10.868 2.884c.321-.662 1.131-.662 1.451 0l2.106 4.322 4.769.694c.73.106 1.02.99.494 1.507l-3.452 3.363.815 4.749c.124.723-.639 1.278-1.29.941L12 17.654l-4.26 2.24c-.651.337-1.415-.218-1.29-.941l.815-4.749L3.82 9.597C3.294 9.07 3.593 8.18 4.323 8.074l4.769-.694 2.106-4.322Z" clipRule="evenodd" />
                          </svg>
                          {movie.rating} / 10
                        </span>
                      )}
                    </div>
                    {/* Detalhes (Ano e Realizador) */}
                    <div className="text-sm text-gray-500 mt-1">
                      {movie.year && (
                        <span>{movie.year}</span>
                      )}
                      {movie.director && movie.year && (
                        <span className="mx-2">|</span>
                      )}
                      {movie.director && (
                        <span>Dir. por: {movie.director}</span>
                      )}
                    </div>
                  </div>
                  
                  {/* Botões de Ação */}
                  <div className="flex gap-3 flex-shrink-0">
                    <button
                      onClick={() => handleOpenEditModal(movie)}
                      disabled={loading}
                      className="text-indigo-600 hover:text-indigo-800 text-sm font-medium disabled:text-gray-300"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => handleDeleteMovie(movie.id)}
                      disabled={loading}
                      className="text-red-500 hover:text-red-700 text-sm font-medium disabled:text-gray-300"
                    >
                      Apagar
                    </button>
                  </div>
                </li>
              ))}
          </ul>
        </div>
      </main>

      {/* --- MODAL DE EDIÇÃO --- */}
      {isModalOpen && currentMovie && (
        <div
          className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center z-50 p-4"
          onClick={handleCloseModal} 
        >
          <div
            className="bg-white rounded-lg shadow-xl w-full max-w-lg p-6"
            onClick={(e) => e.stopPropagation()} 
          >
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Editar Filme: {currentMovie.title}</h2>
            <form onSubmit={handleUpdateMovie} className="space-y-4">
              {/* (Formulário de edição completo...) */}
              <div>
                <label htmlFor="title-edit" className="block text-sm font-medium text-gray-700">Título*</label>
                <input
                  type="text" id="title-edit" name="title"
                  value={editFormData.title}
                  onChange={handleEditFormChange}
                  className="mt-1 flex-grow px-4 py-2 border rounded-md w-full"
                  required disabled={loading}
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="director-edit" className="block text-sm font-medium text-gray-700">Realizador</label>
                  <input
                    type="text" id="director-edit" name="director"
                    value={editFormData.director}
                    onChange={handleEditFormChange}
                    className="mt-1 flex-grow px-4 py-2 border rounded-md w-full"
                    disabled={loading}
                  />
                </div>
                <div>
                  <label htmlFor="genre-edit" className="block text-sm font-medium text-gray-700">Género</label>
                  <input
                    type="text" id="genre-edit" name="genre"
                    value={editFormData.genre}
                    onChange={handleEditFormChange}
                    className="mt-1 flex-grow px-4 py-2 border rounded-md w-full"
                    disabled={loading}
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="year-edit" className="block text-sm font-medium text-gray-700">Ano</label>
                  <input
                    type="number" id="year-edit" name="year"
                    value={editFormData.year}
                    onChange={handleEditFormChange}
                    className="mt-1 flex-grow px-4 py-2 border rounded-md w-full"
                    disabled={loading}
                  />
                </div>
                <div>
                  <label htmlFor="rating-edit" className="block text-sm font-medium text-gray-700">Rating (1-10)</label>
                  <input
                    type="number" id="rating-edit" name="rating"
                    value={editFormData.rating}
                    onChange={handleEditFormChange}
                    min="1" max="10" step="1"
                    className="mt-1 flex-grow px-4 py-2 border rounded-md w-full"
                    disabled={loading}
                  />
                </div>
              </div>
              <div className="flex justify-end gap-4 mt-6">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  disabled={loading}
                  className="py-2 px-4 rounded-md text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="py-2 px-4 rounded-md text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-400"
                >
                  {loading ? 'Salvando...' : 'Salvar Alterações'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Espaçamento inferior para garantir que o scroll funcione bem */}
      <div className="h-20 relative z-1"></div> 
    </div>
  );
}