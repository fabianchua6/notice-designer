/**
 * IRAS Design System - Design Tokens
 * 
 * This file contains all design tokens used throughout the IRAS Notice Designer application.
 * These tokens are based on the IRAS brand guidelines and Singapore Government Design System principles.
 */

// ========================================
// COLOR PALETTE
// ========================================

export const Colors = {
  // Primary Brand Colors
  primary: {
    main: '#2d7bb9',
    dark: '#1e5a8a',
    light: '#4a9fd4',
    lighter: '#e8f4fb',
    contrast: '#ffffff',
  },
  
  // Secondary Colors
  secondary: {
    teal: '#20b4af',
    tealDark: '#178a86',
    tealLight: '#b3ebe9',
    sapphire: '#1173c0',
    navy: '#1a3a52',
  },
  
  // Neutral Colors
  neutral: {
    black: '#1a1a2e',
    grey900: '#2c2c3e',
    grey800: '#3f3f51',
    grey700: '#5c5c6d',
    grey600: '#7a7a8a',
    grey500: '#a7a9ac',
    grey400: '#c4c5c9',
    grey300: '#d9dadc',
    grey200: '#e8e8e8',
    grey100: '#f5f5f5',
    white: '#ffffff',
  },
  
  // Semantic Colors
  semantic: {
    success: '#28a745',
    successLight: '#d4edda',
    successDark: '#1e7e34',
    
    warning: '#ffc107',
    warningLight: '#fff3cd',
    warningDark: '#d39e00',
    
    danger: '#dc3545',
    dangerLight: '#f8d7da',
    dangerDark: '#bd2130',
    
    info: '#17a2b8',
    infoLight: '#d1ecf1',
    infoDark: '#117a8b',
  },
  
  // Background Colors
  background: {
    default: '#f5f7fa',
    paper: '#ffffff',
    elevated: '#ffffff',
    overlay: 'rgba(26, 26, 46, 0.5)',
  },
  
  // Text Colors
  text: {
    primary: '#1a1a2e',
    secondary: '#5c5c6d',
    disabled: '#a7a9ac',
    inverse: '#ffffff',
  },
  
  // Border Colors
  border: {
    default: '#e8e8e8',
    light: '#f5f5f5',
    dark: '#d9dadc',
    focus: '#2d7bb9',
  },
} as const;

// ========================================
// TYPOGRAPHY
// ========================================

export const Typography = {
  fontFamily: {
    primary: "'Roboto', 'Segoe UI', -apple-system, BlinkMacSystemFont, 'Helvetica Neue', sans-serif",
    monospace: "'Roboto Mono', 'Courier New', monospace",
  },
  
  fontSize: {
    xs: '0.75rem',    // 12px
    sm: '0.875rem',   // 14px
    base: '1rem',     // 16px
    lg: '1.125rem',   // 18px
    xl: '1.25rem',    // 20px
    '2xl': '1.5rem',  // 24px
    '3xl': '1.875rem',// 30px
    '4xl': '2.25rem', // 36px
    '5xl': '3rem',    // 48px
  },
  
  fontWeight: {
    light: 300,
    regular: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
  },
  
  lineHeight: {
    tight: 1.25,
    normal: 1.5,
    relaxed: 1.75,
    loose: 2,
  },
  
  letterSpacing: {
    tight: '-0.02em',
    normal: '0',
    wide: '0.02em',
    wider: '0.05em',
  },
} as const;

// ========================================
// SPACING
// ========================================

export const Spacing = {
  xs: '0.25rem',   // 4px
  sm: '0.5rem',    // 8px
  md: '1rem',      // 16px
  lg: '1.5rem',    // 24px
  xl: '2rem',      // 32px
  '2xl': '3rem',   // 48px
  '3xl': '4rem',   // 64px
  '4xl': '6rem',   // 96px
} as const;

// ========================================
// BORDER RADIUS
// ========================================

export const BorderRadius = {
  none: '0',
  sm: '0.25rem',   // 4px
  base: '0.5rem',  // 8px
  lg: '0.75rem',   // 12px
  xl: '1rem',      // 16px
  '2xl': '1.5rem', // 24px
  full: '9999px',
} as const;

// ========================================
// SHADOWS
// ========================================

export const Shadows = {
  none: 'none',
  xs: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
  sm: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px -1px rgba(0, 0, 0, 0.1)',
  base: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1)',
  md: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1)',
  lg: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
  xl: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
  inner: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.05)',
} as const;

// ========================================
// TRANSITIONS
// ========================================

export const Transitions = {
  duration: {
    fast: '150ms',
    base: '200ms',
    slow: '300ms',
    slower: '500ms',
  },
  
  timing: {
    easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
    easeOut: 'cubic-bezier(0, 0, 0.2, 1)',
    easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
  },
} as const;

// ========================================
// BREAKPOINTS
// ========================================

export const Breakpoints = {
  xs: '0px',
  sm: '576px',
  md: '768px',
  lg: '992px',
  xl: '1200px',
  '2xl': '1400px',
} as const;

// ========================================
// Z-INDEX
// ========================================

export const ZIndex = {
  dropdown: 1000,
  sticky: 1020,
  fixed: 1030,
  modalBackdrop: 1040,
  modal: 1050,
  popover: 1060,
  tooltip: 1070,
} as const;

// ========================================
// COMPONENT SPECIFIC TOKENS
// ========================================

export const Components = {
  button: {
    height: {
      sm: '2rem',    // 32px
      md: '2.5rem',  // 40px
      lg: '3rem',    // 48px
    },
    padding: {
      sm: '0.5rem 1rem',
      md: '0.75rem 1.5rem',
      lg: '1rem 2rem',
    },
  },
  
  input: {
    height: {
      sm: '2rem',
      md: '2.5rem',
      lg: '3rem',
    },
    padding: '0.5rem 0.75rem',
  },
  
  card: {
    padding: {
      sm: '1rem',
      md: '1.5rem',
      lg: '2rem',
    },
  },
  
  header: {
    height: '64px',
  },
  
  sidebar: {
    width: '260px',
    collapsedWidth: '72px',
  },
} as const;

// ========================================
// ACCESSIBILITY
// ========================================

export const Accessibility = {
  focusRing: {
    width: '2px',
    offset: '2px',
    color: Colors.primary.main,
  },
  
  minTouchTarget: '44px',
  
  animationDuration: {
    default: '200ms',
    reduced: '0ms', // For users who prefer reduced motion
  },
} as const;

// ========================================
// EXPORT ALL TOKENS
// ========================================

export const DesignTokens = {
  colors: Colors,
  typography: Typography,
  spacing: Spacing,
  borderRadius: BorderRadius,
  shadows: Shadows,
  transitions: Transitions,
  breakpoints: Breakpoints,
  zIndex: ZIndex,
  components: Components,
  accessibility: Accessibility,
} as const;

export type DesignTokens = typeof DesignTokens;
