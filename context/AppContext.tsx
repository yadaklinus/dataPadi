import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserTier } from '@/types/types';
import { MOCK_USER } from '../constants';

interface AppContextType {
  user: User;
  isAuthenticated: boolean;
  login: () => void;
  logout: () => void;
  refreshUser: () => void;
  updateBalance: (amount: number) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Default to false to show the Login page initially
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User>(MOCK_USER);

  const login = () => {
    setIsAuthenticated(true);
  };

  const logout = () => {
    setIsAuthenticated(false);
  };

  const refreshUser = () => {
    // In a real app, this would fetch from API
    setUser({ ...user }); 
  };

  const updateBalance = (newBalance: number) => {
    setUser(prev => ({ ...prev, walletBalance: newBalance }));
  };

  return (
    <AppContext.Provider value={{ user, isAuthenticated, login, logout, refreshUser, updateBalance }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};