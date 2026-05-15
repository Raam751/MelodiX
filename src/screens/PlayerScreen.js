/**
 * Player Screen
 * Full-screen music player with artwork, waveform, and controls
 */

import React, { useEffect, useRef } from 'react';
import {
  View, Text, Image, TouchableOpacity, StyleSheet, Animated, Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { usePlayer } from '../context/PlayerContext';
import GradientBackground from '../components/GradientBackground';
import WaveformVisualizer from '../components/WaveformVisualizer';
import PlayerControls from '../components/PlayerControls';
import { Colors, Typography, Spacing, BorderRadius, Shadow, FontFamily, Gradients } from '../theme';
import { formatCount } from '../utils/formatters';

const { width } = Dimensions.get('window');
const ARTWORK_SIZE = width * 0.7;

const PlayerScreen = ({ navigation }) => {
  const { currentTrack, isPlaying, position, duration } = usePlayer();

  const artworkScale = useRef(new Animated.Value(0.8)).current;
  const contentOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.spring(artworkScale, { toValue: 1, tension: 60, friction: 8, useNativeDriver: true }),
      Animated.timing(contentOpacity, { toValue: 1, duration: 500, useNativeDriver: true }),
    ]).start();
  }, [currentTrack?.id]);

  // Subtle breathing animation for artwork when playing
  useEffect(() => {
    if (isPlaying) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(artworkScale, { toValue: 1.03, duration: 2000, useNativeDriver: true }),
          Animated.timing(artworkScale, { toValue: 1, duration: 2000, useNativeDriver: true }),
        ])
      ).start();
    } else {
      Animated.timing(artworkScale, { toValue: 1, duration: 300, useNativeDriver: true }).start();
    }
  }, [isPlaying]);

  if (!currentTrack) {
    return (
      <GradientBackground colors={Gradients.player}>
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyIcon}>🎧</Text>
          <Text style={styles.emptyTitle}>No Track Selected</Text>
          <Text style={styles.emptyMessage}>Browse the home feed and pick a track to play</Text>
          <TouchableOpacity style={styles.browseButton} onPress={() => navigation.goBack()}>
            <Text style={styles.browseButtonText}>Browse Music</Text>
          </TouchableOpacity>
        </View>
      </GradientBackground>
    );
  }

  const progress = duration > 0 ? position / duration : 0;

  return (
    <GradientBackground colors={Gradients.player}>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.headerButton} onPress={() => navigation.goBack()}>
            <Ionicons name="chevron-down" size={24} color={Colors.textPrimary} />
          </TouchableOpacity>
          <View style={styles.headerCenter}>
            <Text style={styles.headerLabel}>NOW PLAYING</Text>
            <Text style={styles.headerGenre}>{currentTrack.genre}</Text>
          </View>
          <TouchableOpacity style={styles.headerButton}>
            <Ionicons name="share-outline" size={22} color={Colors.textPrimary} />
          </TouchableOpacity>
        </View>

        {/* Artwork */}
        <Animated.View style={[styles.artworkContainer, { transform: [{ scale: artworkScale }] }]}>
          <Image source={{ uri: currentTrack.artwork }} style={styles.artwork} />
        </Animated.View>

        {/* Track Info */}
        <Animated.View style={[styles.trackInfo, { opacity: contentOpacity }]}>
          <Text style={styles.trackTitle} numberOfLines={1}>{currentTrack.title}</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Artist', { artistId: currentTrack.artistId })}>
            <Text style={styles.trackArtist}>{currentTrack.artistName}</Text>
          </TouchableOpacity>
          <View style={styles.trackMeta}>
            <Ionicons name="disc-outline" size={14} color={Colors.textMuted} />
            <Text style={styles.trackAlbum}>{currentTrack.album}</Text>
            <Text style={styles.trackDot}>·</Text>
            <Ionicons name="play" size={10} color={Colors.textMuted} />
            <Text style={styles.trackPlays}>{formatCount(currentTrack.plays)}</Text>
          </View>
        </Animated.View>

        {/* Waveform */}
        <View style={styles.waveformContainer}>
          <WaveformVisualizer isPlaying={isPlaying} progress={progress} />
        </View>

        {/* Controls */}
        <PlayerControls />
      </View>
    </GradientBackground>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, paddingTop: 50 },
  emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: Spacing['2xl'] },
  emptyIcon: { fontSize: 64, marginBottom: Spacing.lg },
  emptyTitle: { ...Typography.h2, color: Colors.textPrimary, marginBottom: Spacing.sm },
  emptyMessage: { ...Typography.body, color: Colors.textSecondary, textAlign: 'center', marginBottom: Spacing.xl },
  browseButton: { backgroundColor: Colors.accent, paddingHorizontal: Spacing.xl, paddingVertical: Spacing.md, borderRadius: BorderRadius.full, ...Shadow.accent },
  browseButtonText: { ...Typography.button, color: Colors.textWhite },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: Spacing.lg, marginBottom: Spacing.xl },
  headerButton: { width: 40, height: 40, borderRadius: 20, backgroundColor: Colors.cardBackground, justifyContent: 'center', alignItems: 'center', ...Shadow.sm },
  headerCenter: { alignItems: 'center' },
  headerLabel: { fontFamily: FontFamily.semiBold, fontSize: 10, color: Colors.textMuted, letterSpacing: 2 },
  headerGenre: { ...Typography.captionMedium, color: Colors.textSecondary, marginTop: 2 },
  artworkContainer: { alignItems: 'center', marginBottom: Spacing.xl },
  artwork: { width: ARTWORK_SIZE, height: ARTWORK_SIZE, borderRadius: BorderRadius['2xl'], backgroundColor: Colors.borderLight, ...Shadow.lg },
  trackInfo: { alignItems: 'center', paddingHorizontal: Spacing.xl },
  trackTitle: { fontFamily: FontFamily.bold, fontSize: 24, color: Colors.textPrimary, textAlign: 'center' },
  trackArtist: { ...Typography.bodyMedium, color: Colors.accent, marginTop: 4 },
  trackMeta: { flexDirection: 'row', alignItems: 'center', marginTop: Spacing.sm },
  trackAlbum: { ...Typography.caption, color: Colors.textMuted, marginLeft: 4 },
  trackDot: { ...Typography.caption, color: Colors.textMuted, marginHorizontal: 6 },
  trackPlays: { ...Typography.caption, color: Colors.textMuted, marginLeft: 3 },
  waveformContainer: { marginTop: Spacing.lg, paddingHorizontal: Spacing.xl },
});

export default PlayerScreen;
