import React, { createContext, useContext, useState } from 'react';

interface AuthContextType {
  isAuthenticated: boolean;
  user: { email: string } | null;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (email: string, password: string, confirmPassword: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<{ email: string } | null>(null);

  const login = async (email: string, password: string): Promise<boolean> => {
    // Mock authentication
    if (email && password) {
      setIsAuthenticated(true);
      setUser({ email });
      return true;
    }
    return false;
  };

  const signup = async (email: string, password: string, confirmPassword: string): Promise<{ success: boolean; error?: string }> => {
    // Mock signup validation
    if (!email || !password || !confirmPassword) {
      return { success: false, error: 'すべてのフィールドを入力してください' };
    }

    if (password !== confirmPassword) {
      return { success: false, error: 'パスワードが一致しません' };
    }

    if (password.length < 8) {
      return { success: false, error: 'パスワードは8文字以上で入力してください' };
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return { success: false, error: '有効なメールアドレスを入力してください' };
    }

    // Mock successful signup
    setIsAuthenticated(true);
    setUser({ email });
    return { success: true };
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}