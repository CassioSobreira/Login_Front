import type { ReactNode } from 'react';
import {createContext,useContext,useState,useEffect} from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const API_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';

interface User {
  id: number | string;
  name: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean; 
  initialLoading: boolean; 
  login: (token: string, user: User) => void; 
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
  const [loading, setLoading] = useState(false); 
  const [initialLoading, setInitialLoading] = useState(true); 
  const isAuthenticated = !!token;
  const navigate = useNavigate();

  useEffect(() => {
    const storedToken = getStoredToken();
    const storedUser = getStoredUser();

    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(storedUser);
    }
    setInitialLoading(false); 
  }, []); 

  
  const login = (newToken: string, newUser: User) => {
    setToken(newToken);
    setUser(newUser);
    localStorage.setItem('token', newToken);
    localStorage.setItem('user', JSON.stringify(newUser));
    console.log('Login realizado, token e user armazenados.');
  };

  
  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    console.log('Logout realizado, token e user removidos.');
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

      if (response.status === 204) {
        return null;
      }

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || `Erro ${response.status}`);
      }

      return data as T;
    } catch (error: any) {
      console.error('Erro na requisição API:', error.message);
      toast.error(error.message || 'Erro inesperado ao aceder à API.');
      return null;
    } finally {
      setLoading(false);
    }
  };

  const value: AuthContextType = {
    user,
    token,
    isAuthenticated,
    loading,
    initialLoading,
    login,
    logout,
    api, 
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

