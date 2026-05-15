/**
 * PlayerControls Component
 * Full playback controls for the player screen
 * Includes shuffle, skip back, play/pause, skip forward, repeat, and favorite
 */

import React, { memo, useCallback } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Slider from './Slider';
import { usePlayer } from '../context/PlayerContext';
import { useFavorites } from '../context/FavoritesContext';
import { Colors, Typography, Spacing, Shadow } from '../theme';
import { formatTime } from '../utils/formatters';
import { PLAYER_STATE } from '../utils/constants';

const PlayerControls = memo(() => {
  const {
    currentTrack,
    isPlaying,
    playerState,
    position,
    duration,
    togglePlayPause,
    seekTo,
    skipForward,
    skipBackward,
    playNext,
    playPrevious,
  } = usePlayer();

  const { isFavorite, toggleFavorite } = useFavorites();

  const isFav = currentTrack ? isFavorite(currentTrack.id) : false;
  const progress = duration > 0 ? position / duration : 0;

  const handleSeek = useCallback(
    (value) => {
      if (duration > 0) {
        seekTo(value * duration);
      }
    },
    [duration, seekTo]
  );

  const handleFavorite = useCallback(() => {
    if (currentTrack) {
      toggleFavorite(currentTrack.id);
    }
  }, [currentTrack, toggleFavorite]);

  return (
    <View style={styles.container}>
      {/* Progress slider */}
      <Slider
        value={progress}
        onValueChange={handleSeek}
        trackColor={Colors.progressTrack}
        fillColor={Colors.accent}
        thumbColor={Colors.accent}
      />

      {/* Time labels */}
      <View style={styles.timeRow}>
        <Text style={styles.timeText}>
          {formatTime(position / 1000)}
        </Text>
        <Text style={styles.timeText}>
          {formatTime(duration / 1000)}
        </Text>
      </View>

      {/* Main controls */}
      <View style={styles.controlsRow}>
        {/* Shuffle */}
        <TouchableOpacity style={styles.secondaryButton} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
          <Ionicons name="shuffle" size={22} color={Colors.textSecondary} />
        </TouchableOpacity>

        {/* Skip back 10s */}
        <TouchableOpacity
          style={styles.skipButton}
          onPress={skipBackward}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Ionicons name="play-back" size={28} color={Colors.textPrimary} />
        </TouchableOpacity>

        {/* Play/Pause */}
        <TouchableOpacity
          style={styles.playButton}
          onPress={togglePlayPause}
          activeOpacity={0.8}
        >
          {playerState === PLAYER_STATE.LOADING ? (
            <Ionicons name="hourglass" size={32} color={Colors.textWhite} />
          ) : (
            <Ionicons
              name={isPlaying ? 'pause' : 'play'}
              size={32}
              color={Colors.textWhite}
            />
          )}
        </TouchableOpacity>

        {/* Skip forward 10s */}
        <TouchableOpacity
          style={styles.skipButton}
          onPress={skipForward}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Ionicons name="play-forward" size={28} color={Colors.textPrimary} />
        </TouchableOpacity>

        {/* Favorite */}
        <TouchableOpacity
          style={styles.secondaryButton}
          onPress={handleFavorite}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Ionicons
            name={isFav ? 'heart' : 'heart-outline'}
            size={22}
            color={isFav ? Colors.error : Colors.textSecondary}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing.lg,
  },
  timeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: Spacing.sm,
    paddingHorizontal: Spacing.xs,
  },
  timeText: {
    ...Typography.captionMedium,
    color: Colors.accent,
  },
  controlsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: Spacing.xl,
  },
  secondaryButton: {
    padding: Spacing.md,
  },
  skipButton: {
    padding: Spacing.md,
    marginHorizontal: Spacing.sm,
  },
  playButton: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: Colors.textPrimary,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: Spacing.lg,
    ...Shadow.lg,
  },
});

export default PlayerControls;
