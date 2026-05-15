/**
 * Favorites Context
 * Manages favorite tracks with local persistence
 */

import React, { createContext, useContext, useReducer, useEffect, useCallback } from 'react';
import { saveFavorites, loadFavorites } from '../services/storage';

const FavoritesContext = createContext(null);

const initialState = {
  favorites: [], // Array of track IDs
  isLoaded: false,
};

const favoritesReducer = (state, action) => {
  switch (action.type) {
    case 'LOAD_FAVORITES':
      return {
        ...state,
        favorites: action.payload || [],
        isLoaded: true,
      };
    case 'ADD_FAVORITE':
      if (state.favorites.includes(action.payload)) return state;
      return {
        ...state,
        favorites: [...state.favorites, action.payload],
      };
    case 'REMOVE_FAVORITE':
      return {
        ...state,
        favorites: state.favorites.filter((id) => id !== action.payload),
      };
    case 'CLEAR_FAVORITES':
      return {
        ...state,
        favorites: [],
      };
    default:
      return state;
  }
};

export const FavoritesProvider = ({ children }) => {
  const [state, dispatch] = useReducer(favoritesReducer, initialState);

  // Load favorites on mount
  useEffect(() => {
    const load = async () => {
      const saved = await loadFavorites();
      dispatch({ type: 'LOAD_FAVORITES', payload: saved });
    };
    load();
  }, []);

  // Persist whenever favorites change (after initial load)
  useEffect(() => {
    if (state.isLoaded) {
      saveFavorites(state.favorites);
    }
  }, [state.favorites, state.isLoaded]);

  const toggleFavorite = useCallback((trackId) => {
    if (state.favorites.includes(trackId)) {
      dispatch({ type: 'REMOVE_FAVORITE', payload: trackId });
    } else {
      dispatch({ type: 'ADD_FAVORITE', payload: trackId });
    }
  }, [state.favorites]);

  const isFavorite = useCallback(
    (trackId) => state.favorites.includes(trackId),
    [state.favorites]
  );

  const clearAll = useCallback(() => {
    dispatch({ type: 'CLEAR_FAVORITES' });
  }, []);

  return (
    <FavoritesContext.Provider
      value={{
        favorites: state.favorites,
        isLoaded: state.isLoaded,
        toggleFavorite,
        isFavorite,
        clearAll,
        favoritesCount: state.favorites.length,
      }}
    >
      {children}
    </FavoritesContext.Provider>
  );
};

export const useFavorites = () => {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error('useFavorites must be used within a FavoritesProvider');
  }
  return context;
};
