export const API_BASE_URL = 'http://localhost:8000'; // Local development host

export const DEFAULT_LANGUAGE = 'en';

export const SUPPORTED_LANGUAGES = [
  { code: 'en', name: 'English', flag: '🇬🇧' },
  { code: 'si', name: 'සිංහල', flag: '🇱🇰' },
  { code: 'ta', name: 'தமிழ்', flag: '🇱🇰' }
];

export const CHATBOT_NAME = 'Synexis Transit AI';
export const MAX_MESSAGE_LENGTH = 500;
export const TIMEOUT_DURATION = 8000;

export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Network issue detected. Please check connection.',
  INVALID_INPUT: 'Invalid query input. Please try again.',
  API_ERROR: 'Unable to process transit request.',
};

// Premium Electric Indigo & Slate Palette
export const COLORS = {
  // Primary Palette
  primary: '#4F46E5',        // Electric Indigo
  primaryDark: '#3730A3',    // Deep Indigo
  primaryLight: '#818CF8',   // Soft Violet Tint
  primaryGlow: '#6366F120',  // Glass Glow
  
  // Secondary & Accents
  secondary: '#10B981',      // Emerald Green (Live Status)
  secondaryDark: '#059669',
  secondaryLight: '#34D399',
  
  accent: '#8B5CF6',         // Modern Purple
  accentLight: '#C4B5FD',
  
  // Backgrounds & Surfaces
  background: '#F8FAFC',     // Modern Slate White
  backgroundDark: '#0F172A', // Slate 900
  surface: '#FFFFFF',        // Clean Card Surface
  surfaceSubtle: '#F1F5F9',  // Subtle Input Surface
  
  // Text Colors
  textPrimary: '#0F172A',    // Slate 900
  textSecondary: '#475569',  // Slate 600
  textTertiary: '#94A3B8',   // Slate 400
  textInverse: '#FFFFFF',
  
  // Messages & Bubbles
  userMessage: '#4F46E5',
  botMessage: '#FFFFFF',
  userMessageText: '#FFFFFF',
  botMessageText: '#0F172A',
  
  // Status Colors
  success: '#10B981',
  warning: '#F59E0B',
  error: '#EF4444',
  info: '#3B82F6',
  
  // Borders & Dividers
  border: '#E2E8F0',
  borderLight: '#F1F5F9',
  glassBorder: 'rgba(255, 255, 255, 0.25)',
  
  // Shadow
  shadow: '#0F172A',
};

// Typography Scale
export const TYPOGRAPHY = {
  fontSize: {
    xs: 12,
    sm: 13,
    base: 15,
    lg: 17,
    xl: 20,
    '2xl': 24,
    '3xl': 28,
    '4xl': 34,
  },
  
  fontWeight: {
    regular: '400' as const,
    medium: '500' as const,
    semibold: '600' as const,
    bold: '700' as const,
  },
  
  lineHeight: {
    tight: 1.2,
    normal: 1.45,
    relaxed: 1.65,
  },
};

// Spacing scale
export const SPACING = {
  xs: 6,
  sm: 10,
  md: 16,
  lg: 22,
  xl: 30,
  '2xl': 44,
};

// Border Radii
export const RADIUS = {
  xs: 6,
  sm: 10,
  md: 14,
  lg: 20,
  xl: 26,
  full: 9999,
};

// Elevation & Drop Shadows
export const SHADOWS = {
  sm: {
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 2,
  },
  md: {
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  lg: {
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.12,
    shadowRadius: 20,
    elevation: 8,
  },
};

// Quick Travel Suggestion Prompts
export const QUICK_PROMPTS = [
  { id: '1', title: '🚌 Colombo to Kandy', query: 'What bus options are available from Colombo to Kandy?' },
  { id: '2', title: '🚆 Galle Express Train', query: 'Show me morning train schedules to Galle' },
  { id: '3', title: '📍 Fort Live Status', query: 'Track train schedules departing from Colombo Fort' },
  { id: '4', title: '✈️ Katunayake Express', query: 'Buses to Bandaranayake Airport Katunayake' },
];