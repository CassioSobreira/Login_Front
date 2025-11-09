
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'react-toastify';

export default function LoginPage() {
  const { login, loading } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.warn('Por favor, preencha todos os campos.');
      return;
    }

    try {
      await login(email, password);
      toast.success('Login realizado com sucesso!');
    } catch (error) {
      console.error("Falha no login (tratada e mostrada pelo AuthContext)");
    }
  };

  return (
    <div
      className="
        flex min-h-screen flex-col justify-center items-center p-4
        bg-cover bg-center bg-fixed
        bg-[url('/images/background-image-login-register-mobile.jpg')]
        md:bg-[url('/images/background-image-login-register.png')]
      "
    >
      <div className="absolute inset-0 bg-black opacity-50 z-0"></div>
      
      <div className="w-full max-w-md bg-white rounded-lg shadow-xl p-8 z-10">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">Login</h2>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="seu.email@exemplo.com"
              disabled={loading}
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Senha</label>
            <div className="relative mt-1">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="••••••••"
                minLength={6}
                disabled={loading}
                className="block w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-700"
              >
                {showPassword ? '🙈' : '👁️'}
              </button>
            </div>
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 px-4 rounded-md text-white bg-indigo-600 hover:bg-indigo-700 transition-colors disabled:bg-gray-400"
          >
            {loading ? 'Entrando...' : 'Entrar'}
          </button>
        </form>
        <p className="text-center text-sm text-gray-600 mt-6">
          Não tem conta?{' '}
          <Link to="/register" className="font-medium text-indigo-600 hover:underline">
            Registre-se
          </Link>
        </p>
      </div>
    </div>
  );
}