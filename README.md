# 🎵 MelodiX — Mini Music App

A stunning React Native music streaming app with a sky-blue gradient theme, featuring mock authentication, home feed, full music player, artist profiles, favorites system, and backend audio streaming.

![React Native](https://img.shields.io/badge/React_Native-Expo_SDK_54-blue?logo=expo)
![Node.js](https://img.shields.io/badge/Backend-Node.js_+_Express-green?logo=node.js)
![License](https://img.shields.io/badge/License-MIT-yellow)

---

## ✨ Features

### Core Features
- **Mock Login** — Personalized greeting, persistent auth state
- **Home Feed** — Trending tracks, recently played, recommendations, and top artists
- **Music Player** — Full-screen player with animated artwork, waveform visualizer, and playback controls
- **Artist Profiles** — Cover image, bio, stats, follow button, and track listing
- **Search** — Integrated search bar with real-time filtering across tracks, artists, and genres

### Bonus Features
- **Resume Last Session** — Automatically restores the last playing track on app reopen
- **Favorites System** — Heart/favorite toggle with local persistence and a dedicated Favorites screen
- **Backend Audio Streaming** — Express server with HTTP Range-based streaming for low-latency playback

### Player Behavior
- Only one track plays at a time — starting a new track stops the previous
- Currently playing track is clearly highlighted in all track lists
- Auto-advances to next track in playlist when current track finishes

---

## 📁 Project Structure

```
MelodiX/
├── App.js                          # Entry point with providers & font loading
├── app.json                        # Expo configuration
├── src/
│   ├── navigation/
│   │   └── AppNavigator.js         # Auth flow + Tab/Stack navigation
│   ├── screens/
│   │   ├── LoginScreen.js          # Animated login with floating notes
│   │   ├── HomeScreen.js           # Feed with search, sections, artists
│   │   ├── PlayerScreen.js         # Full-screen player with waveform
│   │   ├── ArtistScreen.js         # Artist profile with tracks
│   │   └── FavoritesScreen.js      # Persisted favorites list
│   ├── components/
│   │   ├── GradientBackground.js   # Sky-blue gradient wrapper
│   │   ├── TrackCard.js            # Track list item with play state
│   │   ├── ArtistCard.js           # Colorful artist card
│   │   ├── MiniPlayer.js           # Bottom mini player bar
│   │   ├── PlayerControls.js       # Play/pause, skip, seek controls
│   │   ├── WaveformVisualizer.js   # Animated audio waveform
│   │   ├── Slider.js               # Custom touch-friendly progress slider
│   │   ├── LoadingState.js         # Animated loading indicator
│   │   ├── ErrorState.js           # Error with retry button
│   │   └── EmptyState.js           # Empty list placeholder
│   ├── context/
│   │   ├── AuthContext.js          # Mock authentication state
│   │   ├── PlayerContext.js        # Global playback state management
│   │   └── FavoritesContext.js     # Favorites with persistence
│   ├── services/
│   │   ├── api.js                  # Axios client + API calls + fallback
│   │   ├── storage.js              # AsyncStorage helpers
│   │   └── audioService.js         # expo-av audio playback singleton
│   ├── data/
│   │   └── mockData.js             # Fallback mock data (6 artists, 12 tracks)
│   ├── theme/
│   │   ├── colors.js               # Color palette & gradients
│   │   ├── typography.js           # Outfit font system
│   │   ├── spacing.js              # Spacing, shadows, layout constants
│   │   └── index.js                # Barrel export
│   └── utils/
│       ├── constants.js            # API URLs, storage keys, screen names
│       └── formatters.js           # Time, count, and text formatters
├── server/
│   ├── index.js                    # Express server with streaming
│   ├── data/
│   │   ├── tracks.json             # Track metadata
│   │   └── artists.json            # Artist metadata
│   └── audio/
│       └── sample.mp3              # Royalty-free sample audio
└── README.md
```

---

## 🏗️ Architecture & Approach

### Design Decisions

| Decision | Rationale |
|----------|-----------|
| **Expo (managed workflow)** | Simplifies setup, provides built-in audio (expo-av), and enables cloud APK builds via EAS without local Android SDK |
| **React Context + useReducer** | App complexity doesn't warrant Redux — 3 focused contexts (Auth, Player, Favorites) keep state management simple and predictable |
| **expo-av for audio** | Seamlessly integrated with Expo, supports streaming, progress tracking, and background playback |
| **HTTP Range streaming** | Enables low-latency audio start and seeking without downloading the entire file first |
| **AsyncStorage for persistence** | Lightweight and sufficient for small datasets (favorites list, session state, auth) |
| **Outlet font family** | Premium, modern feel — consistent across platforms via `@expo-google-fonts/outfit` |
| **Mock data fallback** | App works fully offline — if the backend is down, mock data is served automatically |

### Layer Separation

- **UI Layer**: Screens + Components (pure presentation)
- **Logic Layer**: Context providers + hooks (state management)
- **Data Layer**: Services (API, storage, audio)
- **Theme Layer**: Centralized design tokens

### State Flow

```
User Action → Context Dispatch → Reducer → New State → Re-render
                                    ↓
                              Side Effects (storage, audio)
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and npm
- Expo CLI: `npm install -g expo-cli` (optional, can use `npx`)
- Expo Go app on your phone (for testing) OR Android emulator

### 1. Clone & Install

```bash
git clone https://github.com/Raam751/MelodiX.git
cd MelodiX
npm install
```

### 2. Start the Backend Server

```bash
cd server
npm install
npm start
```

The server runs on `http://localhost:3001`. You should see:
```
🎵 MelodiX Server running on http://localhost:3001
```

### 3. Start the App

In a new terminal:
```bash
# From project root
npx expo start
```

Then:
- **Expo Go**: Scan the QR code with Expo Go app
- **Android Emulator**: Press `a` to open in emulator
- **iOS Simulator**: Press `i` to open in simulator

### 4. Build APK (EAS)

```bash
npm install -g eas-cli
eas login
eas build:configure
eas build -p android --profile preview
```

---

## 🎨 Design Theme

- **Primary gradient**: Sky blue (`#87CEEB`) → White (`#FFFFFF`)
- **Accent**: Vibrant orange (`#FF6B35`) for CTAs and highlights
- **Typography**: Outfit font family (Google Fonts)
- **Cards**: White with subtle glassmorphism and soft shadows
- **Animations**: Floating music notes, breathing artwork, animated waveform, smooth transitions

---

## 📱 Key Screens

1. **Login** — Animated logo, floating music notes, name input
2. **Home** — Greeting, search bar, artist carousel, track sections
3. **Player** — Full-screen with artwork zoom, waveform, seek controls
4. **Artist** — Cover image, stats, follow, play all, track list
5. **Favorites** — Persisted favorite tracks with empty state

---

## ⚡ Performance Optimizations

- `React.memo` on TrackCard, ArtistCard, MiniPlayer for render optimization
- `useCallback` on event handlers to prevent unnecessary re-renders
- Debounced search (300ms) to minimize API calls
- Audio singleton pattern to prevent multiple playback instances
- Lazy data loading with proper loading/error states

---

## 🛠️ Technologies

| Tech | Version | Purpose |
|------|---------|---------|
| React Native | 0.81 | Core framework |
| Expo | SDK 54 | Managed workflow |
| React Navigation | v6 | Navigation |
| expo-av | Latest | Audio playback |
| AsyncStorage | Latest | Local persistence |
| Axios | Latest | HTTP client |
| Express | 4.18 | Backend server |

---

## 📝 License

MIT License — feel free to use and modify.
