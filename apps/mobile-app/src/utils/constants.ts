export const API_BASE_URL = 'http://localhost:8000';

export const DEFAULT_LANGUAGE = 'en';

export const SUPPORTED_LANGUAGES = [
  { code: 'en', name: 'English', flag: '🇬🇧' },
  { code: 'si', name: 'සිංහල', flag: '🇱🇰' },
  { code: 'ta', name: 'தமிழ்', flag: '🇱🇰' }
];

export const CHATBOT_NAME = 'Synexis Assistant';
export const MAX_MESSAGE_LENGTH = 500;
export const TIMEOUT_DURATION = 8000;

export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Network issue detected. Please try again.',
  INVALID_INPUT: 'Invalid query. Please try again.',
  API_ERROR: 'Unable to process transit request.',
};

// Clean, Minimalist Palette (Apple-inspired simplicity)
export const COLORS = {
  primary: '#2563EB',         // Modern Clean Blue
  primaryDark: '#1D4ED8',
  primaryLight: '#3B82F6',
  
  secondary: '#10B981',       // Soft Green
  accent: '#6366F1',
  
  background: '#F9FAFB',      // Soft Clean Off-White
  surface: '#FFFFFF',         // Pure White
  surfaceSubtle: '#F3F4F6',   // Light Grey Fill
  
  textPrimary: '#111827',     // Dark Charcoal
  textSecondary: '#6B7280',   // Neutral Grey
  textTertiary: '#9CA3AF',    // Soft Muted Grey
  textInverse: '#FFFFFF',
  
  userMessage: '#2563EB',
  botMessage: '#FFFFFF',
  userMessageText: '#FFFFFF',
  botMessageText: '#111827',
  
  border: '#E5E7EB',          // Subtle Border
  borderLight: '#F3F4F6',
  
  shadow: '#000000',
};

export const TYPOGRAPHY = {
  fontSize: {
    xs: 12,
    sm: 14,
    base: 16,
    lg: 18,
    xl: 20,
    '2xl': 24,
    '3xl': 28,
  },
  
  fontWeight: {
    regular: '400' as const,
    medium: '500' as const,
    semibold: '600' as const,
    bold: '700' as const,
  },
  
  lineHeight: {
    normal: 1.4,
    relaxed: 1.6,
  },
};

export const SPACING = {
  xs: 6,
  sm: 10,
  md: 16,
  lg: 24,
  xl: 32,
};

export const RADIUS = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  full: 9999,
};

export const SHADOWS = {
  sm: {
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  md: {
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
};

export const QUICK_PROMPTS = [
  { id: '1', title: 'Colombo to Kandy', query: 'What bus options are available from Colombo to Kandy?' },
  { id: '2', title: 'Galle Express Train', query: 'Show me morning train schedules to Galle' },
  { id: '3', title: 'Colombo Fort Status', query: 'Track train schedules departing from Colombo Fort' },
];