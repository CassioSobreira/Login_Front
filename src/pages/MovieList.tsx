import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'react-toastify';


interface IMovie {
  id: number;
  title: string;
  director?: string | null;
  year?: number | null;
  genre?: string | null;
  rating?: number | null;
}
interface MovieFormData {
  title: string;
  director: string;
  year: string;
  genre: string;
  rating: string;
}

export default function MovieList() {
  const { api, loading } = useAuth(); 
  const [movies, setMovies] = useState<IMovie[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentMovie, setCurrentMovie] = useState<IMovie | null>(null);
  const [editFormData, setEditFormData] = useState<MovieFormData>({
    title: '', director: '', year: '', genre: '', rating: ''
  });

  
  const fetchMovies = async () => {
    console.log('Buscando filmes da API...');
    const data = await api<IMovie[]>('GET', '/movies');
    if (data) {
      setMovies(data);
    }
  };

  
  useEffect(() => {
    fetchMovies();
    
  }, []); 

  const handleDeleteMovie = async (id: number) => {
    if (window.confirm('Tem certeza que deseja apagar este filme?')) {
      const data = await api('DELETE', `/movies/${id}`);
      if (data) { 
        toast.success('Filme apagado com sucesso.');
        setMovies(movies.filter((movie) => movie.id !== id));
      }
    }
  };

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

    const data = await api<{ message: string, movie: IMovie }>('PATCH', `/movies/${currentMovie.id}`, updatedData);

    if (data && data.movie) {
      toast.success('Filme atualizado com sucesso!'); 
      setMovies(movies.map(movie => movie.id === data.movie.id ? data.movie : movie));
      handleCloseModal(); 
    }
  };

  return (
    <>
      
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
    </>
  );
}