/**
 * App-wide constants
 */

// Backend server URL - change this to your server's IP when running on device
export const API_BASE_URL = 'http://10.0.2.2:3001'; // Android emulator localhost
export const API_BASE_URL_IOS = 'http://localhost:3001';

// AsyncStorage keys
export const STORAGE_KEYS = {
  AUTH_USER: '@melodix_auth_user',
  FAVORITES: '@melodix_favorites',
  LAST_SESSION: '@melodix_last_session',
  LAST_TRACK: '@melodix_last_track',
};

// Screen names
export const SCREENS = {
  LOGIN: 'Login',
  MAIN_TABS: 'MainTabs',
  HOME: 'Home',
  FAVORITES: 'Favorites',
  PLAYER: 'Player',
  ARTIST: 'Artist',
};

// Animation durations
export const ANIMATION = {
  fast: 150,
  normal: 300,
  slow: 500,
};

// Player states
export const PLAYER_STATE = {
  IDLE: 'idle',
  LOADING: 'loading',
  PLAYING: 'playing',
  PAUSED: 'paused',
  ERROR: 'error',
};
