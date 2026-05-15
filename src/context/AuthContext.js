/**
 * Authentication Context
 * Manages mock login state with persistence
 */

import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { saveUser, loadUser, clearUser } from '../services/storage';

const AuthContext = createContext(null);

const initialState = {
  user: null,
  isAuthenticated: false,
  isLoading: true,
};

const authReducer = (state, action) => {
  switch (action.type) {
    case 'RESTORE_USER':
      return {
        ...state,
        user: action.payload,
        isAuthenticated: !!action.payload,
        isLoading: false,
      };
    case 'LOGIN':
      return {
        ...state,
        user: action.payload,
        isAuthenticated: true,
        isLoading: false,
      };
    case 'LOGOUT':
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        isLoading: false,
      };
    case 'SET_LOADING':
      return {
        ...state,
        isLoading: action.payload,
      };
    default:
      return state;
  }
};

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Restore user on app start
  useEffect(() => {
    const restoreAuth = async () => {
      try {
        const savedUser = await loadUser();
        dispatch({ type: 'RESTORE_USER', payload: savedUser });
      } catch (error) {
        dispatch({ type: 'RESTORE_USER', payload: null });
      }
    };
    restoreAuth();
  }, []);

  const login = async (name, avatarUrl) => {
    const user = {
      id: 'user-1',
      name: name || 'Music Lover',
      avatar: avatarUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop',
      email: `${(name || 'user').toLowerCase().replace(/\s/g, '')}@melodix.app`,
    };
    await saveUser(user);
    dispatch({ type: 'LOGIN', payload: user });
  };

  const logout = async () => {
    await clearUser();
    dispatch({ type: 'LOGOUT' });
  };

  return (
    <AuthContext.Provider
      value={{
        ...state,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
