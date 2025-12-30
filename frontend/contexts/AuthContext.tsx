import React, {
  createContext,
  useState,
  useEffect,
  useCallback,
  ReactNode,
} from "react";
import api from "../services/api";
import { User, UserRole } from "../types";
import * as authService from "../services/authService";
import { useNavigate } from "react-router-dom";

const DEV_AUTH = false;
interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  error: string | null;
  login: (
    credentials: authService.LoginCredentials
  ) => Promise<{ user: User; token: string }>;
  register: (userData: authService.RegisterData) => Promise<void>;
  logout: () => void;
  checkAuth: () => Promise<void>;
  isAdmin: boolean;
}

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    const savedUser = localStorage.getItem("userData");
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [token, setToken] = useState<string | null>(
    localStorage.getItem("authToken")
  );
  const [isLoading, setIsLoading] = useState<boolean>(
    !localStorage.getItem("authToken")
  );
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("authToken");
    localStorage.removeItem("userData");
    navigate("/");
  };

  const checkAuth = useCallback(async () => {
    if (DEV_AUTH) {
      const mockUser: User = {
        id: 1,
        name: "dev",
        email: "dev@gmail.com",
        role: UserRole.USER,
      };
      setUser(mockUser);
      setToken("dev-token");
      setIsLoading(false);
      return;
    }
    try {
      const response = await api.get("/auth/me");
      const latestUser = response.data;

      setUser(latestUser);
      localStorage.setItem("userData", JSON.stringify(latestUser));
    } catch (err: any) {
      if (err.response?.status === 401) {
        logout();
      }
    } finally {
        setIsLoading(false);
      }
  }, [logout]);

  useEffect(() => {
  if (token && !DEV_AUTH) {
    checkAuth();
  }
}, []);

  const login = async (credentials: authService.LoginCredentials) => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await authService.login(credentials);
      const { token: newToken, user: loggedInUser } = result;

      localStorage.setItem("authToken", newToken);
      setToken(newToken);
      const userWithCorrectRole = {
        ...loggedInUser,
        role: loggedInUser.role as UserRole,
      };
      setUser(userWithCorrectRole);
      return { user: userWithCorrectRole, token: newToken };
    } catch (err: any) {
      setError(err.message || "Login failed");
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
      navigate("/login");
      alert("Registration successful! Please login.");
    } catch (err: any) {
      setError(err.message || "Registration failed");
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const isAdmin = user?.role === UserRole.ADMIN;

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoading,
        error,
        login,
        register,
        logout,
        checkAuth,
        isAdmin,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = React.useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
