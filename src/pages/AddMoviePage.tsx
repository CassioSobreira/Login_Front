import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom'; // Importar para redirecionar

// (Interface de dados do formulário)
interface MovieFormData {
  title: string;
  director: string;
  year: string;
  genre: string;
  rating: string;
}

// Interface do Filme (DEVE ser igual à do seu backend)
interface IMovie {
  id: number;
  title: string;
  director?: string | null;
  year?: number | null;
  genre?: string | null;
  rating?: number | null;
}

export default function AddMoviePage() {
  const { api, loading } = useAuth();
  const navigate = useNavigate(); // Para redirecionar após o sucesso
  
  const [newMovie, setNewMovie] = useState<MovieFormData>({
    title: '', director: '', year: '', genre: '', rating: ''
  });

  const clearCreateForm = () => {
    setNewMovie({ title: '', director: '', year: '', genre: '', rating: '' });
  };

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

    const data = await api<{ message: string, movie: IMovie }>('POST', '/movies', movieData);
      
    if (data && data.movie) { 
      toast.success('Novo filme adicionado à sua lista!'); 
      clearCreateForm(); 
      // Redireciona de volta para a lista de filmes
      navigate('/dashboard'); 
    }
  };

  return (
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
  );
}