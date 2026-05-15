/**
 * MelodiX Mock Data
 * Fallback data when backend is unavailable
 */

export const mockArtists = [
  {
    id: 'artist-1',
    name: 'Luna Wave',
    genre: 'Electronic',
    bio: 'Luna Wave creates atmospheric electronic soundscapes that blend ambient textures with pulsating rhythms. Known for mesmerizing live performances across major festivals worldwide.',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop',
    coverImage: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800&h=400&fit=crop',
    followers: 245000,
    monthlyListeners: 1800000,
    cardColor: '#FFE4D6',
  },
  {
    id: 'artist-2',
    name: 'Marcus Reed',
    genre: 'Jazz Fusion',
    bio: 'A virtuoso saxophonist blending classic jazz with modern electronic beats. Marcus has performed at Blue Note, Montreux Jazz Festival, and collaborated with top artists.',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop',
    coverImage: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=800&h=400&fit=crop',
    followers: 189000,
    monthlyListeners: 920000,
    cardColor: '#FFF8E1',
  },
  {
    id: 'artist-3',
    name: 'Aria Chen',
    genre: 'Indie Pop',
    bio: 'Singer-songwriter Aria Chen crafts deeply personal indie pop songs with lush arrangements. Her debut album topped indie charts for 12 consecutive weeks.',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop',
    coverImage: 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=800&h=400&fit=crop',
    followers: 312000,
    monthlyListeners: 2100000,
    cardColor: '#E8F5E9',
  },
  {
    id: 'artist-4',
    name: 'DJ Prism',
    genre: 'House',
    bio: 'DJ Prism brings infectious energy to dancefloors worldwide. His unique blend of deep house and tech creates an irresistible groove that keeps crowds moving all night.',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop',
    coverImage: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=800&h=400&fit=crop',
    followers: 156000,
    monthlyListeners: 780000,
    cardColor: '#E3F2FD',
  },
  {
    id: 'artist-5',
    name: 'Sage Hollow',
    genre: 'Lo-fi',
    bio: 'Creating dreamy lo-fi beats perfect for late night studying and relaxation. Sage Hollow has become a staple in the chill beats community.',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&h=200&fit=crop',
    coverImage: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800&h=400&fit=crop',
    followers: 98000,
    monthlyListeners: 560000,
    cardColor: '#F3E5F5',
  },
  {
    id: 'artist-6',
    name: 'The Velvet Keys',
    genre: 'Soul',
    bio: 'The Velvet Keys bring old-school soul into the modern era with rich harmonies and timeless melodies. Their live shows are legendary for their raw emotional power.',
    avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=200&h=200&fit=crop',
    coverImage: 'https://images.unsplash.com/photo-1501612780327-45045538702b?w=800&h=400&fit=crop',
    followers: 210000,
    monthlyListeners: 1200000,
    cardColor: '#FCE4EC',
  },
];

export const mockTracks = [
  {
    id: 'track-1',
    title: 'Midnight Echoes',
    artistId: 'artist-1',
    artistName: 'Luna Wave',
    album: 'Neon Dreams',
    duration: 234,
    artwork: 'https://images.unsplash.com/photo-1614149162883-504ce4d13909?w=300&h=300&fit=crop',
    plays: 1500000,
    genre: 'Electronic',
  },
  {
    id: 'track-2',
    title: 'Golden Hour',
    artistId: 'artist-3',
    artistName: 'Aria Chen',
    album: 'Sunlit Pages',
    duration: 198,
    artwork: 'https://images.unsplash.com/photo-1500462918059-b1a0cb512f1d?w=300&h=300&fit=crop',
    plays: 2300000,
    genre: 'Indie Pop',
  },
  {
    id: 'track-3',
    title: 'Smooth Operator',
    artistId: 'artist-2',
    artistName: 'Marcus Reed',
    album: 'Blue Velvet Sessions',
    duration: 312,
    artwork: 'https://images.unsplash.com/photo-1446057032654-9d8885db76c6?w=300&h=300&fit=crop',
    plays: 890000,
    genre: 'Jazz Fusion',
  },
  {
    id: 'track-4',
    title: 'Electric Pulse',
    artistId: 'artist-4',
    artistName: 'DJ Prism',
    album: 'Club Essentials',
    duration: 276,
    artwork: 'https://images.unsplash.com/photo-1557672172-298e090bd0f1?w=300&h=300&fit=crop',
    plays: 670000,
    genre: 'House',
  },
  {
    id: 'track-5',
    title: 'Rainy Afternoon',
    artistId: 'artist-5',
    artistName: 'Sage Hollow',
    album: 'Quiet Moments',
    duration: 185,
    artwork: 'https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=300&h=300&fit=crop',
    plays: 430000,
    genre: 'Lo-fi',
  },
  {
    id: 'track-6',
    title: 'Velvet Sunrise',
    artistId: 'artist-6',
    artistName: 'The Velvet Keys',
    album: 'Soul Sessions',
    duration: 253,
    artwork: 'https://images.unsplash.com/photo-1504898770365-14faca6a7320?w=300&h=300&fit=crop',
    plays: 1100000,
    genre: 'Soul',
  },
  {
    id: 'track-7',
    title: 'Crystal Waves',
    artistId: 'artist-1',
    artistName: 'Luna Wave',
    album: 'Neon Dreams',
    duration: 267,
    artwork: 'https://images.unsplash.com/photo-1557682250-33bd709cbe85?w=300&h=300&fit=crop',
    plays: 920000,
    genre: 'Electronic',
  },
  {
    id: 'track-8',
    title: 'Paper Hearts',
    artistId: 'artist-3',
    artistName: 'Aria Chen',
    album: 'Sunlit Pages',
    duration: 210,
    artwork: 'https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=300&h=300&fit=crop',
    plays: 1750000,
    genre: 'Indie Pop',
  },
  {
    id: 'track-9',
    title: 'Night Jazz',
    artistId: 'artist-2',
    artistName: 'Marcus Reed',
    album: 'Blue Velvet Sessions',
    duration: 345,
    artwork: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=300&h=300&fit=crop',
    plays: 560000,
    genre: 'Jazz Fusion',
  },
  {
    id: 'track-10',
    title: 'Neon Lights',
    artistId: 'artist-4',
    artistName: 'DJ Prism',
    album: 'Club Essentials',
    duration: 298,
    artwork: 'https://images.unsplash.com/photo-1550684376-efcbd6e3f031?w=300&h=300&fit=crop',
    plays: 420000,
    genre: 'House',
  },
  {
    id: 'track-11',
    title: 'Dreamy Café',
    artistId: 'artist-5',
    artistName: 'Sage Hollow',
    album: 'Quiet Moments',
    duration: 195,
    artwork: 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=300&h=300&fit=crop',
    plays: 380000,
    genre: 'Lo-fi',
  },
  {
    id: 'track-12',
    title: 'Soul Fire',
    artistId: 'artist-6',
    artistName: 'The Velvet Keys',
    album: 'Soul Sessions',
    duration: 278,
    artwork: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=300&fit=crop',
    plays: 890000,
    genre: 'Soul',
  },
];

// Sections for home screen
export const homeSections = {
  trending: {
    title: 'Trending Now 🔥',
    tracks: ['track-2', 'track-1', 'track-8', 'track-6'],
  },
  recentlyPlayed: {
    title: 'Recently Played',
    tracks: ['track-5', 'track-3', 'track-7', 'track-10'],
  },
  recommended: {
    title: 'Recommended For You',
    tracks: ['track-4', 'track-9', 'track-11', 'track-12'],
  },
  topArtists: {
    title: 'Top Artists',
    artists: ['artist-1', 'artist-2', 'artist-3', 'artist-4', 'artist-5', 'artist-6'],
  },
};

/**
 * Helper to get track by ID
 */
export const getTrackById = (id) => mockTracks.find((t) => t.id === id);

/**
 * Helper to get artist by ID
 */
export const getArtistById = (id) => mockArtists.find((a) => a.id === id);

/**
 * Helper to get tracks by artist ID
 */
export const getTracksByArtistId = (artistId) =>
  mockTracks.filter((t) => t.artistId === artistId);

/**
 * Helper to get tracks by IDs
 */
export const getTracksByIds = (ids) =>
  ids.map((id) => getTrackById(id)).filter(Boolean);
