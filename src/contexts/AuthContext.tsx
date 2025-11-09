import React, { createContext, useState, useEffect, useContext, ReactNode } from 'react';
import api from '../services/api';
import * as SecureStore from 'expo-secure-store';

interface SignInResponse {
  access_token: string;
}

interface RegisterResponse {
  access_token: string;
}

export interface AuthContextType {
  signIn: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (name: string, email: string, password: string, password_confirmation: string) => Promise<{ success: boolean; error?: string }>;
  signOut: () => Promise<void>;
  userToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

interface AuthProviderProps {
  children: ReactNode;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [userToken, setUserToken] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const bootstrapAsync = async () => {
      let token;
      try {
        token = await SecureStore.getItemAsync('userToken');
        if (token) {
          setUserToken(token);
          setIsAuthenticated(true);
        }
      } catch (error) {
        console.error('Error loading token:', error);
      } finally {
        setIsLoading(false);
      }
    };

    bootstrapAsync();
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      const response = await api.post('/login', { email, password });
      const { access_token } = response.data;

      await SecureStore.setItemAsync('userToken', access_token);
      setUserToken(access_token);
      setIsAuthenticated(true);

      return { success: true };
    } catch (error: any) {
      let errorMessage = 'An error occurred during sign in';
      if (error.response) {
        errorMessage = error.response.data.message || error.response.statusText;
      } else if (error.request) {
        errorMessage = 'No response from server';
      } else {
        errorMessage = error.message;
      }
      return { success: false, error: errorMessage };
    }
  };

  const register = async (
    name: string,
    email: string,
    password: string,
    password_confirmation: string
  ) => {
    try {
      const response = await api.post('/register', {
        name,
        email,
        password,
        password_confirmation
      });
      const { access_token } = response.data;

      await SecureStore.setItemAsync('userToken', access_token);
      setUserToken(access_token);
      setIsAuthenticated(true);

      return { success: true };
    } catch (error: any) {
      let errorMessage = 'An error occurred during registration';
      if (error.response) {
        errorMessage = error.response.data.message || error.response.statusText;
      } else if (error.request) {
        errorMessage = 'No response from server';
      } else {
        errorMessage = error.message;
      }
      return { success: false, error: errorMessage };
    }
  };

  const signOut = async () => {
    try {
      await api.post('/logout');
    } catch (error) {
      // Logout API call might fail if the token has expired, 
      // but we should still remove the local token
      console.error('Logout API call failed:', error);
    } finally {
      await SecureStore.deleteItemAsync('userToken');
      setUserToken(null);
      setIsAuthenticated(false);
    }
  };

  const value: AuthContextType = {
    signIn,
    register,
    signOut,
    userToken,
    isAuthenticated,
    isLoading,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};