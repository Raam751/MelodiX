/**
 * Home Screen
 * Main feed with search, trending tracks, artists, and recommendations
 */

import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  View, Text, TextInput, ScrollView, TouchableOpacity,
  StyleSheet, Animated, RefreshControl,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';
import { usePlayer } from '../context/PlayerContext';
import { fetchTracks, fetchArtists, searchAll } from '../services/api';
import GradientBackground from '../components/GradientBackground';
import TrackCard from '../components/TrackCard';
import ArtistCard from '../components/ArtistCard';
import LoadingState from '../components/LoadingState';
import ErrorState from '../components/ErrorState';
import EmptyState from '../components/EmptyState';
import { Colors, Typography, Spacing, BorderRadius, Shadow, FontFamily, MINI_PLAYER_HEIGHT } from '../theme';
import { homeSections, getTracksByIds } from '../data/mockData';
import { SCREENS } from '../utils/constants';

const HomeScreen = ({ navigation }) => {
  const { user, logout } = useAuth();
  const { currentTrack, playTrack } = usePlayer();
  const [tracks, setTracks] = useState([]);
  const [artists, setArtists] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState(null);
  const [isSearching, setIsSearching] = useState(false);
  const headerOpacity = useRef(new Animated.Value(0)).current;
  const searchTimeout = useRef(null);

  const loadData = useCallback(async () => {
    try {
      setError(null);
      const [tracksData, artistsData] = await Promise.all([fetchTracks(), fetchArtists()]);
      setTracks(tracksData);
      setArtists(artistsData);
    } catch (err) {
      setError('Failed to load your music feed');
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadData();
    Animated.timing(headerOpacity, { toValue: 1, duration: 600, useNativeDriver: true }).start();
  }, []);

  const handleRefresh = useCallback(() => { setRefreshing(true); loadData(); }, [loadData]);

  const handleSearch = useCallback((query) => {
    setSearchQuery(query);
    if (searchTimeout.current) clearTimeout(searchTimeout.current);
    if (!query.trim()) { setSearchResults(null); setIsSearching(false); return; }
    setIsSearching(true);
    searchTimeout.current = setTimeout(async () => {
      const results = await searchAll(query);
      setSearchResults(results);
      setIsSearching(false);
    }, 300);
  }, []);

  const handleTrackPress = useCallback((track, playlist) => {
    playTrack(track, playlist || tracks);
    navigation.navigate(SCREENS.PLAYER);
  }, [tracks, playTrack, navigation]);

  const handleArtistPress = useCallback((artist) => {
    navigation.navigate(SCREENS.ARTIST, { artistId: artist.id, artist });
  }, [navigation]);

  const trendingTracks = getTracksByIds(homeSections.trending.tracks);
  const recentTracks = getTracksByIds(homeSections.recentlyPlayed.tracks);
  const recommendedTracks = getTracksByIds(homeSections.recommended.tracks);

  if (isLoading) return <GradientBackground><LoadingState message="Loading your music feed..." /></GradientBackground>;
  if (error) return <GradientBackground><ErrorState message={error} onRetry={loadData} /></GradientBackground>;

  return (
    <GradientBackground>
      <ScrollView
        style={styles.container}
        contentContainerStyle={[styles.contentContainer, currentTrack && { paddingBottom: MINI_PLAYER_HEIGHT + 80 }]}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} tintColor={Colors.accent} />}
      >
        <Animated.View style={[styles.header, { opacity: headerOpacity }]}>
          <View>
            <Text style={styles.greeting}>Hey {user?.name?.split(' ')[0] || 'there'} 👋</Text>
            <Text style={styles.headerSubtitle}>What do you want to listen to?</Text>
          </View>
          <TouchableOpacity style={styles.profileButton} onPress={logout}>
            <Ionicons name="log-out-outline" size={22} color={Colors.textSecondary} />
          </TouchableOpacity>
        </Animated.View>

        <View style={styles.searchContainer}>
          <Ionicons name="search" size={18} color={Colors.textMuted} />
          <TextInput style={styles.searchInput} placeholder="Search tracks, artists, genres..." placeholderTextColor={Colors.textMuted} value={searchQuery} onChangeText={handleSearch} autoCorrect={false} />
          {searchQuery.length > 0 && <TouchableOpacity onPress={() => handleSearch('')}><Ionicons name="close-circle" size={18} color={Colors.textMuted} /></TouchableOpacity>}
        </View>

        {searchQuery.length > 0 ? (
          <View style={styles.searchResults}>
            {isSearching ? <LoadingState message="Searching..." /> : searchResults ? (
              <>
                {searchResults.artists?.length > 0 && (
                  <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Artists</Text>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.artistsScroll}>
                      {searchResults.artists.map((a) => <ArtistCard key={a.id} artist={a} onPress={handleArtistPress} />)}
                    </ScrollView>
                  </View>
                )}
                {searchResults.tracks?.length > 0 ? (
                  <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Tracks</Text>
                    {searchResults.tracks.map((t) => <TrackCard key={t.id} track={t} playlist={searchResults.tracks} onPress={handleTrackPress} />)}
                  </View>
                ) : <EmptyState icon="🔍" title="No results found" message={`Nothing for "${searchQuery}"`} />}
              </>
            ) : null}
          </View>
        ) : (
          <>
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Top Artists</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.artistsScroll}>
                {artists.map((a) => <ArtistCard key={a.id} artist={a} onPress={handleArtistPress} />)}
              </ScrollView>
            </View>
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>{homeSections.trending.title}</Text>
              <View style={styles.trackList}>{trendingTracks.map((t) => <TrackCard key={t.id} track={t} playlist={trendingTracks} onPress={handleTrackPress} />)}</View>
            </View>
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>{homeSections.recentlyPlayed.title}</Text>
              <View style={styles.trackList}>{recentTracks.map((t) => <TrackCard key={t.id} track={t} playlist={recentTracks} onPress={handleTrackPress} />)}</View>
            </View>
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>{homeSections.recommended.title}</Text>
              <View style={styles.trackList}>{recommendedTracks.map((t) => <TrackCard key={t.id} track={t} playlist={recommendedTracks} onPress={handleTrackPress} />)}</View>
            </View>
          </>
        )}
      </ScrollView>
    </GradientBackground>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  contentContainer: { paddingTop: 60, paddingBottom: 100 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', paddingHorizontal: Spacing.lg, marginBottom: Spacing.lg },
  greeting: { fontFamily: FontFamily.bold, fontSize: 28, color: Colors.textPrimary },
  headerSubtitle: { ...Typography.bodySm, color: Colors.textSecondary, marginTop: 4 },
  profileButton: { width: 40, height: 40, borderRadius: 20, backgroundColor: Colors.cardBackground, justifyContent: 'center', alignItems: 'center', ...Shadow.sm },
  searchContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.cardBackgroundSolid, borderRadius: BorderRadius.lg, paddingHorizontal: Spacing.base, paddingVertical: Spacing.md, marginHorizontal: Spacing.lg, marginBottom: Spacing.xl, ...Shadow.sm },
  searchInput: { flex: 1, ...Typography.bodySm, color: Colors.textPrimary, marginLeft: Spacing.sm, paddingVertical: 0 },
  searchResults: { minHeight: 200 },
  section: { marginBottom: Spacing.xl },
  sectionTitle: { ...Typography.h3, color: Colors.textPrimary, paddingHorizontal: Spacing.lg, marginBottom: Spacing.md },
  artistsScroll: { paddingHorizontal: Spacing.lg, paddingBottom: Spacing.sm },
  trackList: { paddingHorizontal: Spacing.lg },
});

export default HomeScreen;
