/**
 * AsyncStorage helper service
 * Handles all local persistence for MelodiX
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import { STORAGE_KEYS } from '../utils/constants';

/**
 * Save data to AsyncStorage
 */
export const saveData = async (key, data) => {
  try {
    const jsonValue = JSON.stringify(data);
    await AsyncStorage.setItem(key, jsonValue);
    return true;
  } catch (error) {
    console.error(`Error saving data for key ${key}:`, error);
    return false;
  }
};

/**
 * Load data from AsyncStorage
 */
export const loadData = async (key) => {
  try {
    const jsonValue = await AsyncStorage.getItem(key);
    return jsonValue != null ? JSON.parse(jsonValue) : null;
  } catch (error) {
    console.error(`Error loading data for key ${key}:`, error);
    return null;
  }
};

/**
 * Remove data from AsyncStorage
 */
export const removeData = async (key) => {
  try {
    await AsyncStorage.removeItem(key);
    return true;
  } catch (error) {
    console.error(`Error removing data for key ${key}:`, error);
    return false;
  }
};

/**
 * Save user auth state
 */
export const saveUser = (user) => saveData(STORAGE_KEYS.AUTH_USER, user);

/**
 * Load user auth state
 */
export const loadUser = () => loadData(STORAGE_KEYS.AUTH_USER);

/**
 * Clear user auth state
 */
export const clearUser = () => removeData(STORAGE_KEYS.AUTH_USER);

/**
 * Save favorites list
 */
export const saveFavorites = (favorites) =>
  saveData(STORAGE_KEYS.FAVORITES, favorites);

/**
 * Load favorites list
 */
export const loadFavorites = () => loadData(STORAGE_KEYS.FAVORITES);

/**
 * Save last session state (screen + track)
 */
export const saveSession = (session) =>
  saveData(STORAGE_KEYS.LAST_SESSION, session);

/**
 * Load last session state
 */
export const loadSession = () => loadData(STORAGE_KEYS.LAST_SESSION);

/**
 * Clear all app data
 */
export const clearAllData = async () => {
  try {
    const keys = Object.values(STORAGE_KEYS);
    await AsyncStorage.multiRemove(keys);
    return true;
  } catch (error) {
    console.error('Error clearing all data:', error);
    return false;
  }
};
