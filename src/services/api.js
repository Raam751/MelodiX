/**
 * API Service
 * Handles communication with the backend server
 * Falls back to mock data when server is unavailable
 */

import axios from 'axios';
import { Platform } from 'react-native';
import { API_BASE_URL, API_BASE_URL_IOS } from '../utils/constants';
import { mockTracks, mockArtists, getTracksByArtistId } from '../data/mockData';

// Use different localhost addresses for Android emulator vs iOS
const baseURL = Platform.OS === 'android' ? API_BASE_URL : API_BASE_URL_IOS;

const apiClient = axios.create({
  baseURL,
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json',
  },
});

let isBackendOnline = true;

/**
 * Fetch all tracks
 */
export const fetchTracks = async () => {
  try {
    const response = await apiClient.get('/api/tracks');
    isBackendOnline = true;
    return response.data;
  } catch (error) {
    console.log('Backend unavailable, using mock data for tracks');
    isBackendOnline = false;
    return mockTracks;
  }
};

/**
 * Fetch a single track by ID
 */
export const fetchTrackById = async (trackId) => {
  try {
    const response = await apiClient.get(`/api/tracks/${trackId}`);
    isBackendOnline = true;
    return response.data;
  } catch (error) {
    console.log('Backend unavailable, using mock data for track');
    isBackendOnline = false;
    return mockTracks.find((t) => t.id === trackId) || null;
  }
};

/**
 * Fetch all artists
 */
export const fetchArtists = async () => {
  try {
    const response = await apiClient.get('/api/artists');
    isBackendOnline = true;
    return response.data;
  } catch (error) {
    console.log('Backend unavailable, using mock data for artists');
    isBackendOnline = false;
    return mockArtists;
  }
};

/**
 * Fetch artist by ID with their tracks
 */
export const fetchArtistById = async (artistId) => {
  try {
    const response = await apiClient.get(`/api/artists/${artistId}`);
    isBackendOnline = true;
    return response.data;
  } catch (error) {
    console.log('Backend unavailable, using mock data for artist');
    isBackendOnline = false;
    const artist = mockArtists.find((a) => a.id === artistId);
    if (artist) {
      return {
        ...artist,
        tracks: getTracksByArtistId(artistId),
      };
    }
    return null;
  }
};

/**
 * Get the streaming URL for a track
 */
export const getStreamUrl = (trackId) => {
  if (!isBackendOnline) {
    // If backend is unreachable, use royalty-free public MP3s based on track ID
    const num = parseInt(trackId.replace('track-', '')) || 1;
    const songNum = ((num - 1) % 16) + 1; // SoundHelix has 1-16
    return `https://www.soundhelix.com/examples/mp3/SoundHelix-Song-${songNum}.mp3`;
  }
  return `${baseURL}/api/stream/${trackId}`;
};

/**
 * Search tracks and artists
 */
export const searchAll = async (query) => {
  try {
    const response = await apiClient.get(`/api/search?q=${encodeURIComponent(query)}`);
    return response.data;
  } catch (error) {
    console.log('Backend unavailable, searching mock data');
    const lowerQuery = query.toLowerCase();
    const tracks = mockTracks.filter(
      (t) =>
        t.title.toLowerCase().includes(lowerQuery) ||
        t.artistName.toLowerCase().includes(lowerQuery) ||
        t.genre.toLowerCase().includes(lowerQuery)
    );
    const artists = mockArtists.filter(
      (a) =>
        a.name.toLowerCase().includes(lowerQuery) ||
        a.genre.toLowerCase().includes(lowerQuery)
    );
    return { tracks, artists };
  }
};

export default apiClient;
