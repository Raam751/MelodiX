/**
 * Favorites Screen
 * Displays user's favorited tracks with persistence
 */

import React, { useCallback } from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { usePlayer } from '../context/PlayerContext';
import { useFavorites } from '../context/FavoritesContext';
import GradientBackground from '../components/GradientBackground';
import TrackCard from '../components/TrackCard';
import EmptyState from '../components/EmptyState';
import { getTrackById } from '../data/mockData';
import { Colors, Typography, Spacing, FontFamily, MINI_PLAYER_HEIGHT } from '../theme';
import { SCREENS } from '../utils/constants';

const FavoritesScreen = ({ navigation }) => {
  const { currentTrack, playTrack } = usePlayer();
  const { favorites } = useFavorites();

  // Get full track objects for favorite IDs
  const favoriteTracks = favorites.map((id) => getTrackById(id)).filter(Boolean);

  const handleTrackPress = useCallback((track) => {
    playTrack(track, favoriteTracks);
    navigation.navigate(SCREENS.PLAYER);
  }, [favoriteTracks, playTrack, navigation]);

  return (
    <GradientBackground>
      <ScrollView
        style={styles.container}
        contentContainerStyle={[
          styles.contentContainer,
          currentTrack && { paddingBottom: MINI_PLAYER_HEIGHT + 80 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Favorites ❤️</Text>
          <Text style={styles.subtitle}>
            {favoriteTracks.length} {favoriteTracks.length === 1 ? 'track' : 'tracks'}
          </Text>
        </View>

        {/* Track List or Empty State */}
        {favoriteTracks.length > 0 ? (
          <View style={styles.trackList}>
            {favoriteTracks.map((track) => (
              <TrackCard
                key={track.id}
                track={track}
                playlist={favoriteTracks}
                onPress={handleTrackPress}
              />
            ))}
          </View>
        ) : (
          <EmptyState
            icon="💖"
            title="No favorites yet"
            message="Tap the heart icon on any track to add it to your favorites"
          />
        )}
      </ScrollView>
    </GradientBackground>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  contentContainer: { paddingTop: 60, paddingBottom: 100 },
  header: { paddingHorizontal: Spacing.lg, marginBottom: Spacing.xl },
  title: { fontFamily: FontFamily.bold, fontSize: 28, color: Colors.textPrimary },
  subtitle: { ...Typography.bodySm, color: Colors.textSecondary, marginTop: 4 },
  trackList: { paddingHorizontal: Spacing.lg },
});

export default FavoritesScreen;
