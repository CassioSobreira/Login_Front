import type { ReactNode } from 'react';
import React, {createContext,useContext,useState,useEffect} from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

// --- Constantes ---
const API_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';

// --- Interfaces ---
// O objeto User (sem a password)
interface User {
  id: number | string;
  name: string;
  email: string;
}

// O que o nosso contexto irá fornecer
interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean; // Loading global para a API
  initialLoading: boolean; // Loading APENAS para a verificação inicial do token
  login: (token: string, user: User) => void; // Apenas para guardar o token/user
  logout: () => void;
  api: <T>(method: string, endpoint: string, body?: any) => Promise<T | null>; // Wrapper de API
}

interface AuthProviderProps {
  children: ReactNode;
}

// --- Criação do Contexto ---
const AuthContext = createContext<AuthContextType | null>(null);

// --- Hook 'useAuth' ---
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
};

// --- Funções Helper (para localStorage) ---
const getStoredUser = (): User | null => {
  const storedUser = localStorage.getItem('user');
  return storedUser ? JSON.parse(storedUser) : null;
};
const getStoredToken = (): string | null => {
  return localStorage.getItem('token');
};

// --- 'AuthProvider' ---
export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(() => getStoredUser());
  const [token, setToken] = useState<string | null>(() => getStoredToken());
  const [loading, setLoading] = useState(false); // Para chamadas de API
  const [initialLoading, setInitialLoading] = useState(true); // Para o arranque da app
  const isAuthenticated = !!token;
  const navigate = useNavigate();

  // Efeito para verificar o localStorage SÓ no arranque
  useEffect(() => {
    const storedToken = getStoredToken();
    const storedUser = getStoredUser();

    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(storedUser);
    }
    setInitialLoading(false); // Termina o loading inicial
  }, []); // Array vazio [] = corre só uma vez

  // Função LOGIN (apenas guarda os dados)
  const login = (newToken: string, newUser: User) => {
    setToken(newToken);
    setUser(newUser);
    localStorage.setItem('token', newToken);
    localStorage.setItem('user', JSON.stringify(newUser));
    console.log('Login realizado, token e user armazenados.');
  };

  // Função LOGOUT (limpa tudo e redireciona)
  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    console.log('Logout realizado, token e user removidos.');
    navigate('/login');
  };

  // --- Wrapper 'api' para fetch (usado por TODAS as páginas) ---
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

      // Token expirado (401)
      if (response.status === 401) {
        toast.error('Sessão expirada. Faça login novamente.');
        logout();
        return null;
      }

      // Se a resposta for 204 (No Content) (ex: DELETE bem-sucedido)
      if (response.status === 204) {
        return null; // Retorna null para indicar sucesso sem dados
      }

      const data = await response.json();

      // Erros HTTP (400, 403, 404, 500)
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

  // Valor a partilhar com a aplicação
  const value: AuthContextType = {
    user,
    token,
    isAuthenticated,
    loading,
    initialLoading,
    login,
    logout,
    api, // <-- A função 'api' genérica
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

