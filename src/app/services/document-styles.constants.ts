/**
 * Document Styles Constants
 * 
 * Single source of truth for key styling values used in both:
 * - Preview component (notice-preview-enhanced.scss)
 * - Print/PDF output (document-renderer.service.ts)
 * 
 * When updating these values, also update the corresponding SCSS variables in:
 * - src/app/components/notice-preview-enhanced/notice-preview-enhanced.scss
 * - src/app/design-system/styles/_variables.scss
 */

// =============================================================================
// COLORS
// =============================================================================

export const COLORS = {
  // Primary brand color (IRAS blue)
  primary: '#015AAD',
  primaryLight: '#2d7bb9',
  
  // Text colors
  textPrimary: '#333333',
  textSecondary: '#666666',
  textDark: '#000000',
  textWhite: '#ffffff',
  
  // Border colors
  borderLight: '#dddddd',
  borderPrimary: '#2d7bb9',
  
  // Background colors
  backgroundWhite: '#ffffff',
  backgroundLight: '#f5f5f5',
} as const;

// =============================================================================
// PAGE DIMENSIONS (A4 at print)
// =============================================================================

export const PAGE_DIMENSIONS = {
  // A4 size in mm
  widthMM: '210mm',
  heightMM: '297mm',
  
  // A4 size in pixels (at 96 DPI)
  widthPX: 794,
  heightPX: 1123,
  
  // Margins in mm and px
  marginMM: '14.8mm',
  marginPX: 56,
} as const;

// =============================================================================
// HEADER & FOOTER
// =============================================================================

export const HEADER = {
  // First page full header height (includes address, barcode, etc.)
  fullHeightPX: 200,
  
  // Continuation header height (pages 2+, just logo and tax ref)
  continuationHeightPX: 80,
  
  // Logo dimensions
  logoMaxWidth: 150,
  logoMaxHeight: 80,
} as const;

export const FOOTER = {
  heightPX: 60,
  
  // Footer links
  websiteUrl: 'https://www.iras.gov.sg',
  websiteDisplay: 'www.iras.gov.sg',
  portalUrl: 'https://mytax.iras.gov.sg',
  portalDisplay: 'mytax.iras.gov.sg',
} as const;

// =============================================================================
// DOCUMENT TITLE
// =============================================================================

export const TITLE = {
  backgroundColor: '#015AAD',
  textColor: '#ffffff',
  borderRadius: '20px',
  paddingVertical: '8px',
  paddingHorizontal: '16px',
  fontSize: '16px',
  fontWeight: '500',
} as const;

// =============================================================================
// TYPOGRAPHY
// =============================================================================

export const TYPOGRAPHY = {
  fontFamily: "'Source Sans Pro', Arial, sans-serif",
  
  // Font sizes
  fontSizeBase: '12px',
  fontSizeSmall: '10px',
  fontSizeLarge: '16px',
  
  // Line heights
  lineHeight: 1.6,
} as const;

// =============================================================================
// PRINT-SPECIFIC
// =============================================================================

export const PRINT = {
  // Force background colors to print
  colorAdjust: 'exact',
  
  // Page break behavior
  pageBreakAfter: 'always',
  pageBreakInside: 'avoid',
} as const;
