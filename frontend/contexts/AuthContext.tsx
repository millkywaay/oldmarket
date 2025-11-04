
import React, { createContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { User, UserRole } from '../types';
import * as authService from '../services/authService'; 
import { useNavigate } from 'react-router-dom';

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  error: string | null;
  login: (credentials: authService.LoginCredentials) => Promise<{ user: User; token: string }>;
  register: (userData: authService.RegisterData) => Promise<void>;
  logout: () => void;
  checkAuth: () => Promise<void>;
  isAdmin: boolean;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('authToken'));
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const checkAuth = useCallback(async () => {
    const storedToken = localStorage.getItem('authToken');
    if (storedToken) {
      setToken(storedToken);
      setIsLoading(true);
      try {
        const currentUser = await authService.getMe(storedToken);
        setUser(currentUser);
        setError(null);
      } catch (err) {
        console.error("Failed to fetch user data", err);
        setUser(null);
        setToken(null);
        localStorage.removeItem('authToken');
        setError('Session expired. Please login again.');
      } finally {
        setIsLoading(false);
      }
    } else {
      setUser(null);
      setToken(null);
      setIsLoading(false);
    }
  }, []);


  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  const login = async (credentials: authService.LoginCredentials) => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await authService.login(credentials);
      const { token: newToken, user: loggedInUser } = result;

      localStorage.setItem('authToken', newToken);
      setToken(newToken);
      const userWithCorrectRole = {
        ...loggedInUser,
        role: loggedInUser.role as UserRole
      };
      setUser(userWithCorrectRole);
      return { user: userWithCorrectRole, token: newToken };
    } catch (err: any) {
      setError(err.message || 'Login failed');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (userData: authService.RegisterData) => {
    setIsLoading(true);
    setError(null);
    try {
      await authService.register(userData);
      navigate('/login'); 
      alert('Registration successful! Please login.');
    } catch (err: any) {
      setError(err.message || 'Registration failed');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('authToken');
    navigate('/');
  };

  const isAdmin = user?.role === UserRole.ADMIN;

  return (
    <AuthContext.Provider value={{ user, token, isLoading, error, login, register, logout, checkAuth, isAdmin }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = React.useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
