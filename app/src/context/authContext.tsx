import { createContext, useContext, useState, type ReactNode } from 'react';
import { mockUsers, type User } from '@/lib/mockData';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => { success: boolean; error?: string };
  logout: () => void;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  const login = (email: string, password: string) => {
    // Mock validation
    if (!email || !password) {
      return { success: false, error: 'Email and password are required' };
    }

    const foundUser = mockUsers.find(u => u.email === email);
    
    if (!foundUser) {
      return { success: false, error: 'Invalid email or password' };
    }

    if (foundUser.status === 'pending') {
      return { success: false, error: 'Please set up your password first' };
    }

    // Mock password check (in real app, this would be proper auth)
    if (password.length < 6) {
      return { success: false, error: 'Invalid email or password' };
    }

    setUser(foundUser);
    return { success: true };
  };

  const logout = () => {
    setUser(null);
  };

  const isAdmin = user?.role === 'admin';

  return (
    <AuthContext.Provider value={{ user, login, logout, isAdmin }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
