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

/**
 * Fetch all tracks
 */
export const fetchTracks = async () => {
  try {
    const response = await apiClient.get('/api/tracks');
    return response.data;
  } catch (error) {
    console.log('Backend unavailable, using mock data for tracks');
    return mockTracks;
  }
};

/**
 * Fetch a single track by ID
 */
export const fetchTrackById = async (trackId) => {
  try {
    const response = await apiClient.get(`/api/tracks/${trackId}`);
    return response.data;
  } catch (error) {
    console.log('Backend unavailable, using mock data for track');
    return mockTracks.find((t) => t.id === trackId) || null;
  }
};

/**
 * Fetch all artists
 */
export const fetchArtists = async () => {
  try {
    const response = await apiClient.get('/api/artists');
    return response.data;
  } catch (error) {
    console.log('Backend unavailable, using mock data for artists');
    return mockArtists;
  }
};

/**
 * Fetch artist by ID with their tracks
 */
export const fetchArtistById = async (artistId) => {
  try {
    const response = await apiClient.get(`/api/artists/${artistId}`);
    return response.data;
  } catch (error) {
    console.log('Backend unavailable, using mock data for artist');
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
