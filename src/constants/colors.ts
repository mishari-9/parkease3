// ============================================================
// ParkEase — Color Tokens & Design System
// ============================================================

export const colors = {
  light: {
    primary: '#1A6FBF',
    primaryLight: '#E8F4FD',
    primaryDark: '#0D4A8A',
    secondary: '#2ECC71',
    accent: '#F39C12',
    background: '#F8FAFC',
    surface: '#FFFFFF',
    surfaceAlt: '#F1F5F9',
    text: '#1E293B',
    textSecondary: '#64748B',
    textMuted: '#94A3B8',
    border: '#E2E8F0',
    borderLight: '#F1F5F9',
    error: '#EF4444',
    success: '#2ECC71',
    warning: '#F39C12',
    info: '#3B82F6',

    // Slot status colors
    slotFree: '#2ECC71',
    slotFull: '#EF4444',
    slotLow: '#F39C12',
    slotMaint: '#CBD5E1',

    // Booking status
    statusActive: '#3B82F6',
    statusConfirmed: '#2ECC71',
    statusCompleted: '#64748B',
    statusCancelled: '#EF4444',
    statusPending: '#F39C12',

    // Gradient
    gradientStart: '#1A6FBF',
    gradientEnd: '#0D4A8A',

    // Map
    mapPinGreen: '#2ECC71',
    mapPinYellow: '#F39C12',
    mapPinRed: '#EF4444',
    mapCluster: '#1A6FBF',

    // Overlay
    overlay: 'rgba(0,0,0,0.5)',
    shadow: 'rgba(0,0,0,0.1)',
  },

  dark: {
    primary: '#3B82F6',
    primaryLight: '#1E3A5F',
    primaryDark: '#60A5FA',
    secondary: '#34D399',
    accent: '#FBBF24',
    background: '#0F172A',
    surface: '#1E293B',
    surfaceAlt: '#334155',
    text: '#F1F5F9',
    textSecondary: '#94A3B8',
    textMuted: '#64748B',
    border: '#334155',
    borderLight: '#1E293B',
    error: '#F87171',
    success: '#34D399',
    warning: '#FBBF24',
    info: '#60A5FA',

    slotFree: '#34D399',
    slotFull: '#F87171',
    slotLow: '#FBBF24',
    slotMaint: '#475569',

    statusActive: '#60A5FA',
    statusConfirmed: '#34D399',
    statusCompleted: '#94A3B8',
    statusCancelled: '#F87171',
    statusPending: '#FBBF24',

    gradientStart: '#3B82F6',
    gradientEnd: '#1D4ED8',

    mapPinGreen: '#34D399',
    mapPinYellow: '#FBBF24',
    mapPinRed: '#F87171',
    mapCluster: '#3B82F6',

    overlay: 'rgba(0,0,0,0.7)',
    shadow: 'rgba(0,0,0,0.3)',
  },
};

export const typography = {
  h1: { fontSize: 24, fontWeight: 700 as const },
  h2: { fontSize: 18, fontWeight: 600 as const },
  h3: { fontSize: 16, fontWeight: 600 as const },
  body: { fontSize: 14, fontWeight: 400 as const },
  small: { fontSize: 12, fontWeight: 400 as const },
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const borderRadius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  pill: 9999,
};

export const shadows = {
  sm: '0 1px 2px rgba(0,0,0,0.05)',
  md: '0 4px 6px -1px rgba(0,0,0,0.1)',
  lg: '0 10px 15px -3px rgba(0,0,0,0.1)',
  xl: '0 20px 25px -5px rgba(0,0,0,0.1)',
};
