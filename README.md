# MelodiX - Music Streaming App

MelodiX is a modern, premium music streaming application built with React Native and Expo. It was developed to showcase clean architecture, robust state management, and a highly polished user experience.

## 🚀 Features

### Core Features
- **Mock Authentication**: Fluid, animated login screen with session persistence via `AsyncStorage`.
- **Home Feed**: Dynamic dashboard displaying trending tracks, top artists, and intelligent mock search (with 300ms debounce).
- **Advanced Music Player**: Full-screen player and persistent mini-player. Features include play/pause, progress scrubbing, skip forward/backward (next/prev track queueing).
- **Artist Profiles**: Detailed artist pages showing biography, stats, and a discography tracklist.

### Bonus Features Implemented
- **Resume Last Session**: Navigation state and the last played track are persisted locally. When the app reopens, you are brought back to the exact screen and track you left.
- **Favorites System**: Locally persistent "Liked Tracks" system with a dedicated, real-time updated Favorites tab.
- **Backend Audio Streaming**: A Node.js/Express backend (`/server`) that serves audio files using HTTP `Range` headers. This allows the client (`expo-av`) to stream chunks of audio for the lowest possible playback latency, rather than downloading the entire file upfront.
  - *Fallback Mechanism*: If the backend is unreachable (e.g., when testing a standalone APK offline), the app gracefully falls back to streaming high-quality royalty-free MP3s from SoundHelix.

### Player Strict Requirements
- **Singleton Audio Engine**: Managed by `AudioService.js` to ensure only one track can ever play at a time.
- **Auto-Unload**: Playing a new track safely unloads and destroys the previous audio instance.
- **Visual Feedback**: The currently playing track is highlighted across the entire UI with active states and an animated Waveform Visualizer.

## 📁 Project Architecture

The codebase strictly separates concerns into logic, data, and presentation layers:

```
├── server/                 # Express backend for Range-based audio streaming
├── src/
│   ├── components/         # Pure, reusable UI components (TrackCard, Slider, etc.)
│   ├── context/            # Global state management (Player, Auth, Favorites)
│   ├── data/               # Mock JSON data for tracks and artists
│   ├── navigation/         # React Navigation stacks and tab configs
│   ├── screens/            # Complex screen views tying components and logic
│   ├── services/           # External integration (API, Storage, Audio)
│   ├── theme/              # Design system tokens (Colors, Typography, Spacing)
│   └── utils/              # Helper functions and constants
└── App.js                  # Entry point
```

## 🛠️ Key Decisions & Tradeoffs

1. **Context API vs Redux**: Used React's Context API combined with `useReducer` for the Player state. Since this is a specialized app, Redux would add unnecessary boilerplate, whereas Context provides exact scoping for Player, Auth, and Favorites state independently.
2. **`expo-av` vs `react-native-track-player`**: Chose `expo-av` to remain fully inside the Expo Managed workflow, simplifying the build process. To bypass `expo-av`'s lack of background queueing, the playlist queue logic was built manually within `PlayerContext.js`.
3. **Backend Fallback**: In `api.js`, I added a network-reachability check. When running the APK on a physical device, localhost (`10.0.2.2`) is inaccessible. The app detects this and dynamically reroutes streams to a public CDN so the APK functions perfectly for reviewers out-of-the-box.
4. **Design System**: Built a custom, token-based design system (`src/theme`) instead of using a UI library. This allowed for the implementation of the unique Glassmorphism and sky-blue gradient aesthetics without fighting a library's default styles.

## 🏃‍♂️ How to Run

### 1. Run the Backend Server
```bash
cd server
npm install
npm start
# Server runs on http://localhost:3001
```

### 2. Run the React Native App
Ensure you are using Node 20.x or higher.
```bash
# Return to project root
cd ..
npm install

# Start Expo
npx expo start
```
Press `a` to open in Android emulator, or `i` for iOS simulator.

### 3. Install the APK
You can also download the pre-compiled Android APK from the provided Expo EAS Dashboard link and drag-and-drop it into your Android Emulator.
