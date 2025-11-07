import React, { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const API_URL =
  import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';

interface AuthContextType {
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (token: string) => void;
  logout: () => void;
  api: <T>(method: string, endpoint: string, body?: any) => Promise<T | null>;
}

interface AuthProviderProps {
  children: ReactNode;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [token, setToken] = useState<string | null>(() =>
    localStorage.getItem('token')
  );

  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const isAuthenticated = !!token;

  const login = (newToken: string) => {
    setToken(newToken);
    localStorage.setItem('token', newToken);
    console.log('Login realizado, token armazenado:', newToken);
  };

  const logout = () => {
    setToken(null);
    localStorage.removeItem('token');
    console.log('Logout realizado, token removido.');
    navigate('/login');
  };

  const api = async <T,>(
    method: string,
    endpoint: string,
    body: any = null
  ): Promise<T | null> => {
    setLoading(true);

    const headers = new Headers({
      'Content-Type': 'application/json',
    });

    if (token) {
      headers.append('Authorization', `Bearer ${token}`);
    }

    const config: RequestInit = {
      method,
      headers,
      body: body ? JSON.stringify(body) : null,
    };

    try {
      const response = await fetch(`${API_URL}${endpoint}`, config);

      if (response.status === 401) {
        toast.error('Sessão expirada. Faça login novamente.');
        logout();
        return null;
      }
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.message ||
            `Erro ${response.status}: ${response.statusText}`
        );
      }

      if (response.status === 204) {
        return null;
      }

      const data: T = await response.json();
      return data;
    } catch (error: any) {
      console.error('Erro na requisição API:', error.message);
      toast.error(error.message || 'Erro inesperado ao acessar a API.');
      return null;
    } finally {
      setLoading(false);
    }
  };

  const value: AuthContextType = {
    token,
    isAuthenticated,
    loading,
    login,
    logout,
    api,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
