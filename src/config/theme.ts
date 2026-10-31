/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * Design System Tokens — SANAK GEROBAK
 * Aesthetic: Premium Industrial Commerce
 */

export const THEME_TOKENS = {
  colors: {
    // Primary Identity Palette
    midnightNavy: '#101827',
    deepCharcoal: '#17191D',
    // Premium Accent
    champagneGold: '#D6B46A',
    champagneGoldHover: '#C5A154',
    champagneGoldSubtle: 'rgba(214, 180, 106, 0.12)',
    // Light Surfaces & Text
    warmIvory: '#F6F2E9',
    pureWhite: '#FFFFFF',
    // Secondary Text & Structural Dividers
    mutedGray: '#A4A7AE',
    charcoalBorder: 'rgba(255, 255, 255, 0.08)',
    hairlineDivider: 'rgba(255, 255, 255, 0.06)',
  },

  typography: {
    fonts: {
      display: 'Manrope, Plus Jakarta Sans, sans-serif',
      body: 'Plus Jakarta Sans, sans-serif',
      mono: 'Space Mono, monospace',
    },
    scale: {
      hero: 'text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight',
      sectionHeading: 'text-2xl sm:text-4xl font-bold tracking-tight',
      subheading: 'text-lg sm:text-xl font-medium',
      cardTitle: 'text-lg sm:text-xl font-semibold',
      body: 'text-sm sm:text-base leading-relaxed',
      caption: 'text-xs sm:text-sm',
      label: 'text-xs uppercase tracking-wider font-semibold',
    },
  },

  radius: {
    sm: 'rounded-sm',
    base: 'rounded-md',
    lg: 'rounded-lg',
    xl: 'rounded-xl',
  },

  transitions: {
    smooth: 'transition-all duration-200 ease-out',
    spring: 'transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]',
  },
} as const;
