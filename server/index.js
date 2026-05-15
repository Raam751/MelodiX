/**
 * MelodiX Backend Server
 * Serves track metadata, artist info, and streams audio files
 * Supports HTTP Range requests for low-latency streaming
 */

const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Load data
const tracks = require('./data/tracks.json');
const artists = require('./data/artists.json');

// ==================== TRACK ROUTES ====================

/**
 * GET /api/tracks - Get all tracks
 */
app.get('/api/tracks', (req, res) => {
  res.json(tracks);
});

/**
 * GET /api/tracks/:id - Get single track by ID
 */
app.get('/api/tracks/:id', (req, res) => {
  const track = tracks.find((t) => t.id === req.params.id);
  if (!track) return res.status(404).json({ error: 'Track not found' });
  res.json(track);
});

// ==================== ARTIST ROUTES ====================

/**
 * GET /api/artists - Get all artists
 */
app.get('/api/artists', (req, res) => {
  res.json(artists);
});

/**
 * GET /api/artists/:id - Get artist with their tracks
 */
app.get('/api/artists/:id', (req, res) => {
  const artist = artists.find((a) => a.id === req.params.id);
  if (!artist) return res.status(404).json({ error: 'Artist not found' });

  const artistTracks = tracks.filter((t) => t.artistId === artist.id);
  res.json({ ...artist, tracks: artistTracks });
});

// ==================== SEARCH ====================

/**
 * GET /api/search?q=query - Search tracks and artists
 */
app.get('/api/search', (req, res) => {
  const query = (req.query.q || '').toLowerCase();
  if (!query) return res.json({ tracks: [], artists: [] });

  const matchedTracks = tracks.filter(
    (t) =>
      t.title.toLowerCase().includes(query) ||
      t.artistName.toLowerCase().includes(query) ||
      t.genre.toLowerCase().includes(query)
  );

  const matchedArtists = artists.filter(
    (a) =>
      a.name.toLowerCase().includes(query) ||
      a.genre.toLowerCase().includes(query)
  );

  res.json({ tracks: matchedTracks, artists: matchedArtists });
});

// ==================== AUDIO STREAMING ====================

/**
 * GET /api/stream/:id - Stream audio file with Range support
 * Supports partial content (HTTP 206) for low-latency streaming
 */
app.get('/api/stream/:id', (req, res) => {
  const track = tracks.find((t) => t.id === req.params.id);
  if (!track) return res.status(404).json({ error: 'Track not found' });

  // Map track ID to audio file
  const audioFile = path.join(__dirname, 'audio', `${req.params.id}.mp3`);

  // Check if file exists, fallback to sample audio
  const filePath = fs.existsSync(audioFile)
    ? audioFile
    : path.join(__dirname, 'audio', 'sample.mp3');

  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ error: 'Audio file not found' });
  }

  const stat = fs.statSync(filePath);
  const fileSize = stat.size;
  const range = req.headers.range;

  if (range) {
    // Partial content (Range request) - enables seeking and low-latency start
    const parts = range.replace(/bytes=/, '').split('-');
    const start = parseInt(parts[0], 10);
    const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
    const chunkSize = end - start + 1;

    const stream = fs.createReadStream(filePath, { start, end });

    res.writeHead(206, {
      'Content-Range': `bytes ${start}-${end}/${fileSize}`,
      'Accept-Ranges': 'bytes',
      'Content-Length': chunkSize,
      'Content-Type': 'audio/mpeg',
      'Cache-Control': 'public, max-age=86400',
    });

    stream.pipe(res);
  } else {
    // Full file download
    res.writeHead(200, {
      'Content-Length': fileSize,
      'Content-Type': 'audio/mpeg',
      'Accept-Ranges': 'bytes',
      'Cache-Control': 'public, max-age=86400',
    });

    fs.createReadStream(filePath).pipe(res);
  }
});

// ==================== HEALTH CHECK ====================

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', tracks: tracks.length, artists: artists.length });
});

// ==================== START SERVER ====================

app.listen(PORT, () => {
  console.log(`\n🎵 MelodiX Server running on http://localhost:${PORT}`);
  console.log(`   📡 API: http://localhost:${PORT}/api`);
  console.log(`   🎶 Stream: http://localhost:${PORT}/api/stream/{trackId}`);
  console.log(`   ❤️  Health: http://localhost:${PORT}/api/health\n`);
});
