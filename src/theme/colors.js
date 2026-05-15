/**
 * MelodiX Color Palette
 * Sky blue gradient theme with vibrant orange accents
 */

export const Colors = {
  // Primary gradient
  gradientTop: '#87CEEB',
  gradientMiddle: '#B8E4F0',
  gradientBottom: '#FFFFFF',

  // Accent colors
  accent: '#FF6B35',
  accentLight: '#FF8C5E',
  accentDark: '#E55A2B',

  // Backgrounds
  background: '#F8FBFF',
  cardBackground: 'rgba(255, 255, 255, 0.90)',
  cardBackgroundSolid: '#FFFFFF',
  overlayBackground: 'rgba(0, 0, 0, 0.4)',

  // Text
  textPrimary: '#1A1A2E',
  textSecondary: '#4A5568',
  textMuted: '#9CA3AF',
  textWhite: '#FFFFFF',
  textAccent: '#FF6B35',

  // UI Elements
  border: '#E5E9F0',
  borderLight: '#F0F3F8',
  divider: '#EDF2F7',
  inputBackground: '#F7F9FC',
  shadow: 'rgba(26, 26, 46, 0.08)',
  shadowDark: 'rgba(26, 26, 46, 0.15)',

  // Status
  success: '#10B981',
  error: '#EF4444',
  warning: '#F59E0B',
  info: '#3B82F6',

  // Card accent colors (for artist cards)
  cardOrange: '#FFE4D6',
  cardYellow: '#FFF8E1',
  cardGreen: '#E8F5E9',
  cardBlue: '#E3F2FD',
  cardPink: '#FCE4EC',
  cardPurple: '#F3E5F5',

  // Player
  progressTrack: '#E5E9F0',
  progressFill: '#FF6B35',
  waveformActive: '#FF6B35',
  waveformInactive: '#D1D5DB',
};

export const Gradients = {
  background: [Colors.gradientTop, Colors.gradientMiddle, Colors.gradientBottom],
  card: ['rgba(255, 255, 255, 0.95)', 'rgba(255, 255, 255, 0.85)'],
  accent: [Colors.accent, Colors.accentLight],
  player: [Colors.gradientTop, '#C8E8F5', Colors.gradientBottom],
};
