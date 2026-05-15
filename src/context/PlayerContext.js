/**
 * Player Context
 * Manages global music player state
 * Enforces single-track-at-a-time playback
 */

import React, { createContext, useContext, useReducer, useCallback, useEffect, useRef } from 'react';
import audioService from '../services/audioService';
import { getStreamUrl } from '../services/api';
import { saveSession, loadSession } from '../services/storage';
import { PLAYER_STATE } from '../utils/constants';

const PlayerContext = createContext(null);

const initialState = {
  currentTrack: null,
  playlist: [],
  playerState: PLAYER_STATE.IDLE,
  position: 0, // in milliseconds
  duration: 0, // in milliseconds
  isPlaying: false,
  error: null,
};

const playerReducer = (state, action) => {
  switch (action.type) {
    case 'SET_TRACK':
      return {
        ...state,
        currentTrack: action.payload.track,
        playlist: action.payload.playlist || state.playlist,
        playerState: PLAYER_STATE.LOADING,
        position: 0,
        duration: action.payload.track.duration * 1000 || 0,
        isPlaying: false,
        error: null,
      };
    case 'PLAYING':
      return {
        ...state,
        playerState: PLAYER_STATE.PLAYING,
        isPlaying: true,
        error: null,
      };
    case 'PAUSED':
      return {
        ...state,
        playerState: PLAYER_STATE.PAUSED,
        isPlaying: false,
      };
    case 'UPDATE_PROGRESS':
      return {
        ...state,
        position: action.payload.position,
        duration: action.payload.duration || state.duration,
      };
    case 'ERROR':
      return {
        ...state,
        playerState: PLAYER_STATE.ERROR,
        isPlaying: false,
        error: action.payload,
      };
    case 'STOP':
      return {
        ...initialState,
        playlist: state.playlist,
      };
    case 'RESTORE_SESSION':
      return {
        ...state,
        currentTrack: action.payload.track,
        playlist: action.payload.playlist || [],
        playerState: PLAYER_STATE.PAUSED,
        position: action.payload.position || 0,
        duration: action.payload.track.duration * 1000 || 0,
        isPlaying: false,
      };
    default:
      return state;
  }
};

export const PlayerProvider = ({ children }) => {
  const [state, dispatch] = useReducer(playerReducer, initialState);
  const stateRef = useRef(state);

  // Keep ref in sync
  useEffect(() => {
    stateRef.current = state;
  }, [state]);

  // Initialize audio service and restore session
  useEffect(() => {
    const init = async () => {
      await audioService.init();
      await restoreSession();
    };
    init();
  }, [restoreSession]);

  // Persist session whenever track changes
  useEffect(() => {
    if (state.currentTrack) {
      saveSession({
        track: state.currentTrack,
        playlist: state.playlist,
        position: state.position,
        screen: 'Player',
      });
    }
  }, [state.currentTrack?.id]);

  // Playback status callback
  const handlePlaybackStatus = useCallback((status) => {
    if (!status.isLoaded) {
      if (status.error) {
        dispatch({ type: 'ERROR', payload: status.error });
      }
      return;
    }

    dispatch({
      type: 'UPDATE_PROGRESS',
      payload: {
        position: status.positionMillis || 0,
        duration: status.durationMillis || 0,
      },
    });

    if (status.isPlaying) {
      if (stateRef.current.playerState !== PLAYER_STATE.PLAYING) {
        dispatch({ type: 'PLAYING' });
      }
    } else if (status.isLoaded && !status.isPlaying && !status.isBuffering) {
      if (stateRef.current.playerState === PLAYER_STATE.PLAYING) {
        dispatch({ type: 'PAUSED' });
      }
    }

    // Handle track completion - play next track
    if (status.didJustFinish) {
      const currentState = stateRef.current;
      const currentIndex = currentState.playlist.findIndex(
        (t) => t.id === currentState.currentTrack?.id
      );
      if (currentIndex >= 0 && currentIndex < currentState.playlist.length - 1) {
        // Play next track in playlist
        const nextTrack = currentState.playlist[currentIndex + 1];
        playTrack(nextTrack, currentState.playlist);
      } else {
        dispatch({ type: 'PAUSED' });
      }
    }
  }, []);

  // Set status callback
  useEffect(() => {
    audioService.setOnPlaybackStatusUpdate(handlePlaybackStatus);
  }, [handlePlaybackStatus]);

  /**
   * Play a track - stops any currently playing track first
   */
  const playTrack = useCallback(async (track, playlist = []) => {
    if (!track) return;

    dispatch({ type: 'SET_TRACK', payload: { track, playlist } });

    const streamUrl = getStreamUrl(track.id);
    const success = await audioService.loadAndPlay(streamUrl);

    if (success) {
      dispatch({ type: 'PLAYING' });
    } else {
      dispatch({ type: 'ERROR', payload: 'Failed to load track' });
    }
  }, []);

  /**
   * Toggle play/pause for current track
   */
  const togglePlayPause = useCallback(async () => {
    await audioService.togglePlayPause();
  }, []);

  /**
   * Seek to position (in milliseconds)
   */
  const seekTo = useCallback(async (positionMillis) => {
    await audioService.seekTo(positionMillis);
  }, []);

  /**
   * Skip forward 10 seconds
   */
  const skipForward = useCallback(async () => {
    await audioService.skipForward(10);
  }, []);

  /**
   * Skip backward 10 seconds
   */
  const skipBackward = useCallback(async () => {
    await audioService.skipBackward(10);
  }, []);

  /**
   * Play next track in playlist
   */
  const playNext = useCallback(async () => {
    const currentIndex = state.playlist.findIndex(
      (t) => t.id === state.currentTrack?.id
    );
    if (currentIndex >= 0 && currentIndex < state.playlist.length - 1) {
      await playTrack(state.playlist[currentIndex + 1], state.playlist);
    }
  }, [state.playlist, state.currentTrack, playTrack]);

  /**
   * Play previous track in playlist
   */
  const playPrevious = useCallback(async () => {
    const currentIndex = state.playlist.findIndex(
      (t) => t.id === state.currentTrack?.id
    );
    if (currentIndex > 0) {
      await playTrack(state.playlist[currentIndex - 1], state.playlist);
    }
  }, [state.playlist, state.currentTrack, playTrack]);

  /**
   * Stop playback and clear current track
   */
  const stop = useCallback(async () => {
    await audioService.unload();
    dispatch({ type: 'STOP' });
  }, []);

  /**
   * Restore last session
   */
  const restoreSession = useCallback(async () => {
    const session = await loadSession();
    if (session && session.track) {
      dispatch({ type: 'RESTORE_SESSION', payload: session });
      return session;
    }
    return null;
  }, []);

  return (
    <PlayerContext.Provider
      value={{
        ...state,
        playTrack,
        togglePlayPause,
        seekTo,
        skipForward,
        skipBackward,
        playNext,
        playPrevious,
        stop,
        restoreSession,
      }}
    >
      {children}
    </PlayerContext.Provider>
  );
};

export const usePlayer = () => {
  const context = useContext(PlayerContext);
  if (!context) {
    throw new Error('usePlayer must be used within a PlayerProvider');
  }
  return context;
};
