import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { authAPI, apiClient } from '@/lib/api';

interface AuthUser {
  email: string;
  role: string;
}

interface AuthContextType {
  user: AuthUser | null;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string; requiresPasswordSetup?: boolean }>;
  logout: () => void;
  isAdmin: boolean;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check for existing token on mount
  useEffect(() => {
    const token = apiClient.getToken();
    if (token) {
      // Parse JWT to get user info (basic decode)
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        // Only restore session if email is present in token
        if (payload.email && payload.role) {
          setUser({
            email: payload.email,
            role: payload.role,
          });
        } else {
          // Invalid or old token without email, clear it
          apiClient.setToken(null);
        }
      } catch (error) {
        // Invalid token, clear it
        apiClient.setToken(null);
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const response = await authAPI.login(email, password);
      
      // Check if password setup is required
      if (response.requiresPasswordSetup) {
        return { 
          success: false, 
          requiresPasswordSetup: true,
          error: 'Please set up your password first' 
        };
      }

      // Store token
      apiClient.setToken(response.token);
      
      // Set user info
      setUser({
        email,
        role: response.role,
      });

      return { success: true };
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Invalid credentials';
      return { success: false, error: message };
    }
  };

  const logout = () => {
    authAPI.logout();
    setUser(null);
  };

  const isAdmin = user?.role === 'ADMIN';

  return (
    <AuthContext.Provider value={{ user, login, logout, isAdmin, isLoading }}>
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
