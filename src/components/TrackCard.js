/**
 * TrackCard Component
 * Displays a track in a list with artwork, info, play button, and favorite toggle
 * Shows active state when the track is currently playing
 */

import React, { memo, useCallback } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { usePlayer } from '../context/PlayerContext';
import { useFavorites } from '../context/FavoritesContext';
import { Colors, Typography, Spacing, BorderRadius, Shadow } from '../theme';
import { formatTime, formatCount } from '../utils/formatters';

const TrackCard = memo(({ track, playlist, onPress, showArtist = true, index }) => {
  const { currentTrack, isPlaying } = usePlayer();
  const { isFavorite, toggleFavorite } = useFavorites();

  const isActive = currentTrack?.id === track.id;
  const isFav = isFavorite(track.id);

  const handlePress = useCallback(() => {
    if (onPress) {
      onPress(track, playlist);
    }
  }, [track, playlist, onPress]);

  const handleFavoritePress = useCallback(() => {
    toggleFavorite(track.id);
  }, [track.id, toggleFavorite]);

  return (
    <TouchableOpacity
      style={[styles.container, isActive && styles.containerActive]}
      onPress={handlePress}
      activeOpacity={0.7}
    >
      {/* Track number or artwork */}
      <View style={styles.artworkContainer}>
        <Image source={{ uri: track.artwork }} style={styles.artwork} />
        {isActive && (
          <View style={styles.playingOverlay}>
            <Ionicons
              name={isPlaying ? 'pause' : 'play'}
              size={20}
              color={Colors.textWhite}
            />
          </View>
        )}
      </View>

      {/* Track info */}
      <View style={styles.info}>
        <Text
          style={[styles.title, isActive && styles.titleActive]}
          numberOfLines={1}
        >
          {track.title}
        </Text>
        {showArtist && (
          <Text style={styles.artist} numberOfLines={1}>
            {track.artistName}
          </Text>
        )}
        <View style={styles.meta}>
          <Ionicons name="play" size={10} color={Colors.textMuted} />
          <Text style={styles.metaText}>{formatCount(track.plays)}</Text>
          <Text style={styles.metaDot}>·</Text>
          <Text style={styles.metaText}>{formatTime(track.duration)}</Text>
        </View>
      </View>

      {/* Favorite button */}
      <TouchableOpacity
        style={styles.favoriteButton}
        onPress={handleFavoritePress}
        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
      >
        <Ionicons
          name={isFav ? 'heart' : 'heart-outline'}
          size={20}
          color={isFav ? Colors.error : Colors.textMuted}
        />
      </TouchableOpacity>

      {/* Play button */}
      <TouchableOpacity
        style={[styles.playButton, isActive && styles.playButtonActive]}
        onPress={handlePress}
      >
        <Ionicons
          name={isActive && isPlaying ? 'pause' : 'play'}
          size={18}
          color={isActive ? Colors.textWhite : Colors.accent}
        />
      </TouchableOpacity>
    </TouchableOpacity>
  );
});

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.cardBackground,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    marginBottom: Spacing.sm,
    ...Shadow.sm,
  },
  containerActive: {
    backgroundColor: 'rgba(135, 206, 235, 0.15)',
    borderWidth: 1,
    borderColor: 'rgba(135, 206, 235, 0.3)',
  },
  artworkContainer: {
    width: 52,
    height: 52,
    borderRadius: BorderRadius.md,
    overflow: 'hidden',
    position: 'relative',
  },
  artwork: {
    width: '100%',
    height: '100%',
    backgroundColor: Colors.borderLight,
  },
  playingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    justifyContent: 'center',
    alignItems: 'center',
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
  titleActive: {
    color: Colors.accent,
    fontFamily: Typography.h3.fontFamily,
  },
  artist: {
    ...Typography.caption,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  meta: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  metaText: {
    ...Typography.label,
    color: Colors.textMuted,
    marginLeft: 3,
  },
  metaDot: {
    ...Typography.label,
    color: Colors.textMuted,
    marginHorizontal: 4,
  },
  favoriteButton: {
    padding: Spacing.sm,
  },
  playButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255, 107, 53, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: Spacing.xs,
  },
  playButtonActive: {
    backgroundColor: Colors.accent,
    ...Shadow.accent,
  },
});

export default TrackCard;
