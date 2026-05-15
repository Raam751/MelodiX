/**
 * Audio Service
 * Manages audio playback using expo-av
 * Handles loading, playing, pausing, seeking, and progress tracking
 */

import { Audio } from 'expo-av';

class AudioService {
  constructor() {
    this.sound = null;
    this.isLoaded = false;
    this.onPlaybackStatusUpdate = null;
  }

  /**
   * Initialize audio mode for background playback
   */
  async init() {
    try {
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: false,
        staysActiveInBackground: true,
        playsInSilentModeIOS: true,
        shouldDuckAndroid: true,
        playThroughEarpieceAndroid: false,
      });
    } catch (error) {
      console.error('Error initializing audio mode:', error);
    }
  }

  /**
   * Set the status update callback
   */
  setOnPlaybackStatusUpdate(callback) {
    this.onPlaybackStatusUpdate = callback;
    if (this.sound) {
      this.sound.setOnPlaybackStatusUpdate(callback);
    }
  }

  /**
   * Load and play a track from URL
   * Unloads any currently loaded track first
   */
  async loadAndPlay(uri) {
    try {
      // Unload current track if exists
      await this.unload();

      // Create and load new sound
      const { sound } = await Audio.Sound.createAsync(
        { uri },
        {
          shouldPlay: true,
          progressUpdateIntervalMillis: 250,
          shouldCorrectPitch: true,
          pitchCorrectionQuality: Audio.PitchCorrectionQuality.High,
        },
        this.onPlaybackStatusUpdate
      );

      this.sound = sound;
      this.isLoaded = true;

      return true;
    } catch (error) {
      console.error('Error loading audio:', error);
      this.isLoaded = false;
      return false;
    }
  }

  /**
   * Play / resume current track
   */
  async play() {
    if (this.sound && this.isLoaded) {
      try {
        await this.sound.playAsync();
      } catch (error) {
        console.error('Error playing audio:', error);
      }
    }
  }

  /**
   * Pause current track
   */
  async pause() {
    if (this.sound && this.isLoaded) {
      try {
        await this.sound.pauseAsync();
      } catch (error) {
        console.error('Error pausing audio:', error);
      }
    }
  }

  /**
   * Toggle play/pause
   */
  async togglePlayPause() {
    if (this.sound && this.isLoaded) {
      try {
        const status = await this.sound.getStatusAsync();
        if (status.isPlaying) {
          await this.sound.pauseAsync();
        } else {
          await this.sound.playAsync();
        }
      } catch (error) {
        console.error('Error toggling play/pause:', error);
      }
    }
  }

  /**
   * Seek to position (in milliseconds)
   */
  async seekTo(positionMillis) {
    if (this.sound && this.isLoaded) {
      try {
        await this.sound.setPositionAsync(positionMillis);
      } catch (error) {
        console.error('Error seeking:', error);
      }
    }
  }

  /**
   * Skip forward by seconds
   */
  async skipForward(seconds = 10) {
    if (this.sound && this.isLoaded) {
      try {
        const status = await this.sound.getStatusAsync();
        const newPosition = Math.min(
          status.positionMillis + seconds * 1000,
          status.durationMillis || 0
        );
        await this.sound.setPositionAsync(newPosition);
      } catch (error) {
        console.error('Error skipping forward:', error);
      }
    }
  }

  /**
   * Skip backward by seconds
   */
  async skipBackward(seconds = 10) {
    if (this.sound && this.isLoaded) {
      try {
        const status = await this.sound.getStatusAsync();
        const newPosition = Math.max(status.positionMillis - seconds * 1000, 0);
        await this.sound.setPositionAsync(newPosition);
      } catch (error) {
        console.error('Error skipping backward:', error);
      }
    }
  }

  /**
   * Unload current track and free resources
   */
  async unload() {
    if (this.sound) {
      try {
        await this.sound.stopAsync();
        await this.sound.unloadAsync();
      } catch (error) {
        // Sound might already be unloaded
      }
      this.sound = null;
      this.isLoaded = false;
    }
  }

  /**
   * Get current playback status
   */
  async getStatus() {
    if (this.sound && this.isLoaded) {
      try {
        return await this.sound.getStatusAsync();
      } catch (error) {
        return null;
      }
    }
    return null;
  }
}

// Singleton instance
const audioService = new AudioService();
export default audioService;
