import { useState, useEffect, createContext, useContext, type ReactNode } from 'react';
import type { User } from '@/types';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  loginWithSocial: (provider: 'google' | 'microsoft' | 'facebook', userData: Partial<User>) => Promise<boolean>;
  logout: () => void;
  register: (name: string, email: string, company: string, password: string) => Promise<boolean>;
  resetPassword: (email: string) => Promise<boolean>;
  updateProfile: (data: Partial<User>) => void;
  updateAvatar: (avatarUrl: string) => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const ADMIN_USER: User = {
  id: 'admin-001',
  name: 'rodrigo',
  email: 'rodrigo@admin.com',
  role: 'admin',
  createdAt: new Date(),
  avatar: undefined
};

const MOCK_USERS: Array<{ user: User; password: string }> = [
  { user: ADMIN_USER, password: 'Ale@2020' }
];

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const foundUser = MOCK_USERS.find(
      u => u.user.email === email && u.password === password
    );
    
    if (foundUser) {
      setUser(foundUser.user);
      localStorage.setItem('currentUser', JSON.stringify(foundUser.user));
      setIsLoading(false);
      return true;
    }
    
    if (email.toLowerCase() === 'rodrigo' && password === 'Ale@2020') {
      setUser(ADMIN_USER);
      localStorage.setItem('currentUser', JSON.stringify(ADMIN_USER));
      setIsLoading(false);
      return true;
    }
    
    setIsLoading(false);
    return false;
  };

  const loginWithSocial = async (
    provider: 'google' | 'microsoft' | 'facebook',
    userData: Partial<User>
  ): Promise<boolean> => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const newUser: User = {
      id: `social-${Date.now()}`,
      name: userData.name || 'Usuario',
      email: userData.email || '',
      company: userData.company,
      avatar: userData.avatar,
      role: 'user',
      createdAt: new Date(),
      socialProvider: provider
    };
    
    setUser(newUser);
    localStorage.setItem('currentUser', JSON.stringify(newUser));
    setIsLoading(false);
    return true;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('currentUser');
  };

  const register = async (
    name: string,
    email: string,
    company: string,
    password: string
  ): Promise<boolean> => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const existingUser = MOCK_USERS.find(u => u.user.email === email);
    if (existingUser) {
      setIsLoading(false);
      return false;
    }
    
    const newUser: User = {
      id: `user-${Date.now()}`,
      name,
      email,
      company,
      role: 'user',
      createdAt: new Date()
    };
    
    MOCK_USERS.push({ user: newUser, password });
    setUser(newUser);
    localStorage.setItem('currentUser', JSON.stringify(newUser));
    setIsLoading(false);
    return true;
  };

  const resetPassword = async (email: string): Promise<boolean> => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    const userExists = MOCK_USERS.find(u => u.user.email === email);
    return !!userExists;
  };

  const updateProfile = (data: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...data };
      setUser(updatedUser);
      localStorage.setItem('currentUser', JSON.stringify(updatedUser));
    }
  };

  const updateAvatar = (avatarUrl: string) => {
    if (user) {
      const updatedUser = { ...user, avatar: avatarUrl };
      setUser(updatedUser);
      localStorage.setItem('currentUser', JSON.stringify(updatedUser));
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        loginWithSocial,
        logout,
        register,
        resetPassword,
        updateProfile,
        updateAvatar,
        isLoading
      }}
    >
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
