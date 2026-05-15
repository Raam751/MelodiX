/**
 * MiniPlayer Component
 * Persistent bottom bar showing currently playing track
 * Appears above tab bar when a track is loaded
 */

import React, { memo, useCallback } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { usePlayer } from '../context/PlayerContext';
import { Colors, Typography, Spacing, BorderRadius, Shadow, MINI_PLAYER_HEIGHT } from '../theme';
import { PLAYER_STATE } from '../utils/constants';

const MiniPlayer = memo(({ onPress }) => {
  const {
    currentTrack,
    isPlaying,
    playerState,
    position,
    duration,
    togglePlayPause,
    playNext,
  } = usePlayer();

  const handlePlayPause = useCallback(() => {
    togglePlayPause();
  }, [togglePlayPause]);

  if (!currentTrack) return null;

  const progress = duration > 0 ? (position / duration) * 100 : 0;

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={onPress}
      activeOpacity={0.95}
    >
      {/* Progress bar at top */}
      <View style={styles.progressContainer}>
        <View style={[styles.progressFill, { width: `${progress}%` }]} />
      </View>

      <LinearGradient
        colors={['rgba(255, 255, 255, 0.98)', 'rgba(248, 251, 255, 0.98)']}
        style={styles.content}
      >
        {/* Artwork */}
        <Image source={{ uri: currentTrack.artwork }} style={styles.artwork} />

        {/* Track info */}
        <View style={styles.info}>
          <Text style={styles.title} numberOfLines={1}>
            {currentTrack.title}
          </Text>
          <Text style={styles.artist} numberOfLines={1}>
            {currentTrack.artistName}
          </Text>
        </View>

        {/* Controls */}
        <TouchableOpacity
          style={styles.controlButton}
          onPress={handlePlayPause}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          {playerState === PLAYER_STATE.LOADING ? (
            <Ionicons name="hourglass" size={24} color={Colors.accent} />
          ) : (
            <Ionicons
              name={isPlaying ? 'pause' : 'play'}
              size={24}
              color={Colors.accent}
            />
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.controlButton}
          onPress={playNext}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Ionicons name="play-forward" size={22} color={Colors.textSecondary} />
        </TouchableOpacity>
      </LinearGradient>
    </TouchableOpacity>
  );
});

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: MINI_PLAYER_HEIGHT,
    ...Shadow.lg,
    zIndex: 100,
  },
  progressContainer: {
    height: 2,
    backgroundColor: Colors.progressTrack,
  },
  progressFill: {
    height: '100%',
    backgroundColor: Colors.progressFill,
  },
  content: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.base,
  },
  artwork: {
    width: 48,
    height: 48,
    borderRadius: BorderRadius.sm,
    backgroundColor: Colors.borderLight,
  },
  info: {
    flex: 1,
    marginLeft: Spacing.md,
    marginRight: Spacing.sm,
  },
  title: {
    ...Typography.bodyMedium,
    color: Colors.textPrimary,
  },
  artist: {
    ...Typography.caption,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  controlButton: {
    padding: Spacing.sm,
  },
});

export default MiniPlayer;
