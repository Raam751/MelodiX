/**
 * ArtistCard Component
 * Colorful card for featuring artists in horizontal scrollable lists
 */

import React, { memo } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { Colors, Typography, Spacing, BorderRadius, Shadow } from '../theme';
import { formatCount } from '../utils/formatters';

const ArtistCard = memo(({ artist, onPress }) => {
  return (
    <TouchableOpacity
      style={[styles.container, { backgroundColor: artist.cardColor || Colors.cardOrange }]}
      onPress={() => onPress && onPress(artist)}
      activeOpacity={0.8}
    >
      <Image source={{ uri: artist.avatar }} style={styles.avatar} />
      <Text style={styles.name} numberOfLines={1}>
        {artist.name}
      </Text>
      <Text style={styles.genre} numberOfLines={1}>
        {artist.genre}
      </Text>
      <Text style={styles.followers}>
        {formatCount(artist.followers)} followers
      </Text>
    </TouchableOpacity>
  );
});

const styles = StyleSheet.create({
  container: {
    width: 150,
    borderRadius: BorderRadius.xl,
    padding: Spacing.base,
    marginRight: Spacing.md,
    alignItems: 'center',
    ...Shadow.md,
  },
  avatar: {
    width: 72,
    height: 72,
    borderRadius: 36,
    borderWidth: 3,
    borderColor: 'rgba(255, 255, 255, 0.8)',
    marginBottom: Spacing.md,
    backgroundColor: Colors.borderLight,
  },
  name: {
    ...Typography.bodyMedium,
    color: Colors.textPrimary,
    textAlign: 'center',
  },
  genre: {
    ...Typography.caption,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  followers: {
    ...Typography.label,
    color: Colors.textMuted,
    marginTop: 6,
  },
});

export default ArtistCard;
