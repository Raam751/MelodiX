/**
 * Artist Screen
 * Artist profile with cover image, bio, stats, and track list
 */

import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  View, Text, Image, ScrollView, TouchableOpacity,
  StyleSheet, Animated, Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { usePlayer } from '../context/PlayerContext';
import { fetchArtistById } from '../services/api';
import { getArtistById, getTracksByArtistId } from '../data/mockData';
import GradientBackground from '../components/GradientBackground';
import TrackCard from '../components/TrackCard';
import LoadingState from '../components/LoadingState';
import ErrorState from '../components/ErrorState';
import { Colors, Typography, Spacing, BorderRadius, Shadow, FontFamily, MINI_PLAYER_HEIGHT } from '../theme';
import { formatCount } from '../utils/formatters';
import { SCREENS } from '../utils/constants';

const { width } = Dimensions.get('window');
const COVER_HEIGHT = 280;

const ArtistScreen = ({ route, navigation }) => {
  const { artistId } = route.params;
  const { currentTrack, playTrack } = usePlayer();
  const [artist, setArtist] = useState(route.params.artist || null);
  const [artistTracks, setArtistTracks] = useState([]);
  const [isLoading, setIsLoading] = useState(!route.params.artist);
  const [error, setError] = useState(null);
  const [isFollowing, setIsFollowing] = useState(false);

  const headerOpacity = useRef(new Animated.Value(0)).current;
  const contentSlide = useRef(new Animated.Value(30)).current;

  const loadArtist = useCallback(async () => {
    try {
      setError(null);
      setIsLoading(true);
      const data = await fetchArtistById(artistId);
      if (data) {
        setArtist(data);
        setArtistTracks(data.tracks || getTracksByArtistId(artistId));
      } else {
        // Fallback to mock data
        const mockArtist = getArtistById(artistId);
        if (mockArtist) {
          setArtist(mockArtist);
          setArtistTracks(getTracksByArtistId(artistId));
        } else {
          setError('Artist not found');
        }
      }
    } catch (err) {
      setError('Failed to load artist');
    } finally {
      setIsLoading(false);
    }
  }, [artistId]);

  useEffect(() => {
    if (!artist) {
      loadArtist();
    } else {
      setArtistTracks(getTracksByArtistId(artistId));
      setIsLoading(false);
    }

    Animated.parallel([
      Animated.timing(headerOpacity, { toValue: 1, duration: 600, useNativeDriver: true }),
      Animated.timing(contentSlide, { toValue: 0, duration: 500, useNativeDriver: true }),
    ]).start();
  }, [artistId]);

  const handleTrackPress = useCallback((track) => {
    playTrack(track, artistTracks);
    navigation.navigate(SCREENS.PLAYER);
  }, [artistTracks, playTrack, navigation]);

  const handlePlayAll = useCallback(() => {
    if (artistTracks.length > 0) {
      playTrack(artistTracks[0], artistTracks);
      navigation.navigate(SCREENS.PLAYER);
    }
  }, [artistTracks, playTrack, navigation]);

  if (isLoading) return <GradientBackground><LoadingState message="Loading artist..." /></GradientBackground>;
  if (error) return <GradientBackground><ErrorState message={error} onRetry={loadArtist} /></GradientBackground>;
  if (!artist) return <GradientBackground><ErrorState message="Artist not found" /></GradientBackground>;

  return (
    <GradientBackground>
      <ScrollView
        style={styles.container}
        contentContainerStyle={currentTrack ? { paddingBottom: MINI_PLAYER_HEIGHT + 80 } : { paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Cover Image */}
        <Animated.View style={[styles.coverContainer, { opacity: headerOpacity }]}>
          <Image source={{ uri: artist.coverImage }} style={styles.coverImage} />
          <LinearGradient
            colors={['transparent', 'rgba(135, 206, 235, 0.8)', Colors.gradientTop]}
            style={styles.coverGradient}
          />
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
            <Ionicons name="chevron-back" size={24} color={Colors.textWhite} />
          </TouchableOpacity>
        </Animated.View>

        {/* Artist Info */}
        <Animated.View style={[styles.infoContainer, { opacity: headerOpacity, transform: [{ translateY: contentSlide }] }]}>
          <Image source={{ uri: artist.avatar }} style={styles.avatar} />
          <Text style={styles.artistName}>{artist.name}</Text>
          <Text style={styles.genre}>{artist.genre}</Text>

          {/* Stats */}
          <View style={styles.statsRow}>
            <View style={styles.stat}>
              <Text style={styles.statValue}>{formatCount(artist.followers)}</Text>
              <Text style={styles.statLabel}>Followers</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.stat}>
              <Text style={styles.statValue}>{formatCount(artist.monthlyListeners)}</Text>
              <Text style={styles.statLabel}>Monthly Listeners</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.stat}>
              <Text style={styles.statValue}>{artistTracks.length}</Text>
              <Text style={styles.statLabel}>Tracks</Text>
            </View>
          </View>

          {/* Action buttons */}
          <View style={styles.actionsRow}>
            <TouchableOpacity
              style={[styles.followButton, isFollowing && styles.followingButton]}
              onPress={() => setIsFollowing(!isFollowing)}
            >
              <Ionicons name={isFollowing ? 'checkmark' : 'add'} size={18} color={isFollowing ? Colors.accent : Colors.textWhite} />
              <Text style={[styles.followText, isFollowing && styles.followingText]}>
                {isFollowing ? 'Following' : 'Follow'}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.playAllButton} onPress={handlePlayAll}>
              <Ionicons name="play" size={20} color={Colors.textWhite} />
              <Text style={styles.playAllText}>Play All</Text>
            </TouchableOpacity>
          </View>

          {/* Bio */}
          <Text style={styles.bio}>{artist.bio}</Text>
        </Animated.View>

        {/* Tracks */}
        <View style={styles.tracksSection}>
          <Text style={styles.sectionTitle}>Tracks</Text>
          {artistTracks.map((track) => (
            <TrackCard key={track.id} track={track} playlist={artistTracks} onPress={handleTrackPress} showArtist={false} />
          ))}
        </View>
      </ScrollView>
    </GradientBackground>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  coverContainer: { height: COVER_HEIGHT, position: 'relative' },
  coverImage: { width: '100%', height: '100%', backgroundColor: Colors.borderLight },
  coverGradient: { ...StyleSheet.absoluteFillObject },
  backButton: { position: 'absolute', top: 50, left: Spacing.lg, width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(0,0,0,0.3)', justifyContent: 'center', alignItems: 'center' },
  infoContainer: { alignItems: 'center', marginTop: -50, paddingHorizontal: Spacing.lg },
  avatar: { width: 100, height: 100, borderRadius: 50, borderWidth: 4, borderColor: Colors.cardBackgroundSolid, backgroundColor: Colors.borderLight, ...Shadow.lg },
  artistName: { fontFamily: FontFamily.bold, fontSize: 26, color: Colors.textPrimary, marginTop: Spacing.md },
  genre: { ...Typography.bodyMedium, color: Colors.accent, marginTop: 4 },
  statsRow: { flexDirection: 'row', alignItems: 'center', marginTop: Spacing.lg, backgroundColor: Colors.cardBackground, borderRadius: BorderRadius.xl, padding: Spacing.base, ...Shadow.sm },
  stat: { flex: 1, alignItems: 'center' },
  statValue: { fontFamily: FontFamily.bold, fontSize: 18, color: Colors.textPrimary },
  statLabel: { ...Typography.label, color: Colors.textMuted, marginTop: 2 },
  statDivider: { width: 1, height: 30, backgroundColor: Colors.border },
  actionsRow: { flexDirection: 'row', marginTop: Spacing.lg, gap: Spacing.md },
  followButton: { flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.textPrimary, paddingHorizontal: Spacing.lg, paddingVertical: Spacing.md, borderRadius: BorderRadius.full },
  followingButton: { backgroundColor: 'transparent', borderWidth: 1.5, borderColor: Colors.accent },
  followText: { ...Typography.buttonSm, color: Colors.textWhite, marginLeft: Spacing.xs },
  followingText: { color: Colors.accent },
  playAllButton: { flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.accent, paddingHorizontal: Spacing.lg, paddingVertical: Spacing.md, borderRadius: BorderRadius.full, ...Shadow.accent },
  playAllText: { ...Typography.buttonSm, color: Colors.textWhite, marginLeft: Spacing.xs },
  bio: { ...Typography.bodySm, color: Colors.textSecondary, textAlign: 'center', marginTop: Spacing.lg, lineHeight: 22 },
  tracksSection: { paddingHorizontal: Spacing.lg, marginTop: Spacing.xl },
  sectionTitle: { ...Typography.h3, color: Colors.textPrimary, marginBottom: Spacing.md },
});

export default ArtistScreen;
