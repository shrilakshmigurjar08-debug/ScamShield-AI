import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import type { User } from '../types/threat';
import { loginUser, registerUser } from '../services/db';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<User>;
  register: (email: string, password: string) => Promise<User>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const SESSION_KEY = 'scamshield_session_user';

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Rehydrate existing session from localStorage on app boot
  useEffect(() => {
    try {
      const stored = localStorage.getItem(SESSION_KEY);
      if (stored) {
        const parsed = JSON.parse(stored) as User;
        setUser(parsed);
      }
    } catch (e) {
      console.warn('Failed to restore session from localStorage:', e);
      localStorage.removeItem(SESSION_KEY);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const login = async (email: string, password: string): Promise<User> => {
    setIsLoading(true);
    try {
      const authenticated = await loginUser(email, password);
      setUser(authenticated);
      localStorage.setItem(SESSION_KEY, JSON.stringify(authenticated));
      return authenticated;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (email: string, password: string): Promise<User> => {
    setIsLoading(true);
    try {
      const created = await registerUser(email, password);
      setUser(created);
      localStorage.setItem(SESSION_KEY, JSON.stringify(created));
      return created;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem(SESSION_KEY);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
