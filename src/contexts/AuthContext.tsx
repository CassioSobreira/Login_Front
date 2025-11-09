import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react'; 
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const API_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';
const API_TYPE = import.meta.env.VITE_API_TYPE || 'postgres'; // 'mongo' ou 'postgres'

console.log('API Type:', API_TYPE);

export interface User {
  id: number | string;
  name: string;
  email: string;
}

export interface IMovie {
  id: number | string;
  title: string;
  director?: string | null;
  year?: number | null;
  genre?: string | null;
  rating?: number | null;
}

export interface MovieFormData {
  title: string;
  director: string;
  year: string;
  genre: string;
  rating: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  initialLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
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


const getStoredUser = (): User | null => {
  const storedUser = localStorage.getItem('user');
  return storedUser ? JSON.parse(storedUser) : null;
};
const getStoredToken = (): string | null => {
  return localStorage.getItem('token');
};


export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(() => getStoredUser());
  const [token, setToken] = useState<string | null>(() => getStoredToken());
  const [loading, setLoading] = useState(true);
  const [apiLoading, setApiLoading] = useState(false);

  const isAuthenticated = !!token;
  const navigate = useNavigate();

  useEffect(() => {
    const storedToken = getStoredToken();
    const storedUser = getStoredUser();

    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(storedUser);
    }
    setLoading(false);
  }, []);


  const normalizeData = (data: any): any => {
    if (!data) return null;
    if (API_TYPE === 'mongo' && data._id) {
      const { _id, ...rest } = data;
      return { id: _id, ...rest };
    }
    return data;
  };

  const api = async <T,>(
    method: string,
    endpoint: string,
    body: any = null
  ): Promise<T | null> => {
    setApiLoading(true);
    const headers = new Headers({ 'Content-Type': 'application/json' });
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

      if (response.status === 204) {
        return true as T;
      }

      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(responseData.message || `Erro ${response.status}`);
      }

      
      if (responseData.movie) {
        responseData.movie = normalizeData(responseData.movie);
      } else if (responseData.user) {
        responseData.user = normalizeData(responseData.user);
      } else if (Array.isArray(responseData)) {
        return responseData.map(normalizeData) as T;
      } else {
        return normalizeData(responseData) as T;
      }

      return responseData as T;
    } catch (error: any) {
      console.error('Erro na requisição API:', error.message);
      toast.error(error.message || 'Erro inesperado ao aceder à API.');
      return null;
    } finally {
      setApiLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const data = await api<{ token: string; user: User }>('POST', '/auth/login', { email, password });

      if (data && data.token && data.user) {
        setToken(data.token);
        setUser(data.user);
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        navigate('/dashboard');
      } else {
        throw new Error("Falha ao obter token ou dados do utilizador.");
      }
    } catch (err) {
      console.error("Erro no login:", err);
      throw err;
    }
  };

  const register = async (name: string, email: string, password: string) => {
    try {
      const data = await api('POST', '/auth/register', { name, email, password });
      if (data) {
        navigate('/login');
      }
    } catch (err) {
      throw err;
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    console.log('Logout realizado, token e user removidos.');
    navigate('/login');
  };


  const value: AuthContextType = {
    user,
    token,
    isAuthenticated,
    loading: loading || apiLoading,
    initialLoading: loading,
    login,
    register,
    logout,
    api,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};