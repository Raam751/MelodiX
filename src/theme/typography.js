/**
 * MelodiX Typography System
 * Uses Outfit font family for a modern, premium feel
 */

export const FontFamily = {
  regular: 'Outfit_400Regular',
  medium: 'Outfit_500Medium',
  semiBold: 'Outfit_600SemiBold',
  bold: 'Outfit_700Bold',
  extraBold: 'Outfit_800ExtraBold',
};

export const FontSizes = {
  xs: 10,
  sm: 12,
  md: 14,
  base: 16,
  lg: 18,
  xl: 20,
  '2xl': 24,
  '3xl': 28,
  '4xl': 32,
  '5xl': 40,
};

export const LineHeights = {
  tight: 1.2,
  normal: 1.4,
  relaxed: 1.6,
};

export const Typography = {
  h1: {
    fontFamily: FontFamily.bold,
    fontSize: FontSizes['3xl'],
    lineHeight: FontSizes['3xl'] * LineHeights.tight,
  },
  h2: {
    fontFamily: FontFamily.semiBold,
    fontSize: FontSizes['2xl'],
    lineHeight: FontSizes['2xl'] * LineHeights.tight,
  },
  h3: {
    fontFamily: FontFamily.semiBold,
    fontSize: FontSizes.lg,
    lineHeight: FontSizes.lg * LineHeights.tight,
  },
  body: {
    fontFamily: FontFamily.regular,
    fontSize: FontSizes.base,
    lineHeight: FontSizes.base * LineHeights.normal,
  },
  bodyMedium: {
    fontFamily: FontFamily.medium,
    fontSize: FontSizes.base,
    lineHeight: FontSizes.base * LineHeights.normal,
  },
  bodySm: {
    fontFamily: FontFamily.regular,
    fontSize: FontSizes.md,
    lineHeight: FontSizes.md * LineHeights.normal,
  },
  caption: {
    fontFamily: FontFamily.regular,
    fontSize: FontSizes.sm,
    lineHeight: FontSizes.sm * LineHeights.normal,
  },
  captionMedium: {
    fontFamily: FontFamily.medium,
    fontSize: FontSizes.sm,
    lineHeight: FontSizes.sm * LineHeights.normal,
  },
  label: {
    fontFamily: FontFamily.medium,
    fontSize: FontSizes.xs,
    lineHeight: FontSizes.xs * LineHeights.normal,
  },
  button: {
    fontFamily: FontFamily.semiBold,
    fontSize: FontSizes.base,
    lineHeight: FontSizes.base * LineHeights.tight,
  },
  buttonSm: {
    fontFamily: FontFamily.semiBold,
    fontSize: FontSizes.md,
    lineHeight: FontSizes.md * LineHeights.tight,
  },
};
