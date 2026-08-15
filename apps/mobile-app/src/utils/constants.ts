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

// Citymapper / Apple Maps Production Transit Palette
export const COLORS = {
  primary: '#2563EB',         // Citymapper Blue
  primaryDark: '#1E3A8A',
  primaryLight: '#EFF6FF',
  
  navy: '#0F172A',            // Slate Header
  
  trainBadgeBg: '#DBEAFE',
  trainBadgeText: '#1E40AF',
  
  busBadgeBg: '#FEF3C7',
  busBadgeText: '#92400E',
  
  expressBadgeBg: '#D1FAE5',
  expressBadgeText: '#065F46',
  
  background: '#F8FAFC',
  surface: '#FFFFFF',
  surfaceSubtle: '#F1F5F9',
  
  textPrimary: '#0F172A',
  textSecondary: '#475569',
  textTertiary: '#94A3B8',
  textInverse: '#FFFFFF',
  
  userMessage: '#2563EB',
  botMessage: '#FFFFFF',
  userMessageText: '#FFFFFF',
  botMessageText: '#0F172A',
  
  border: '#E2E8F0',
  borderLight: '#F1F5F9',
  
  shadow: '#0F172A',
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
};

export const POPULAR_DEPARTURES = [
  {
    id: '1',
    route: 'Colombo Fort → Galle',
    line: 'Coastal Line',
    vehicle: 'Ruhunu Kumari (Train 8058)',
    departs: '06:30 AM',
    duration: '2h 30m',
    type: 'train',
    query: 'Show me morning train schedules to Galle',
  },
  {
    id: '2',
    route: 'Colombo → Kandy',
    line: 'Central Expressway',
    vehicle: 'Expressway Luxury (Bus EX-1)',
    departs: '07:00 AM',
    duration: '2h 30m',
    type: 'bus',
    query: 'What bus options are available from Colombo to Kandy?',
  },
  {
    id: '3',
    route: 'Colombo Fort → Badulla',
    line: 'Main Line',
    vehicle: 'Podi Menike (Train 1005)',
    departs: '05:55 AM',
    duration: '8h 45m',
    type: 'train',
    query: 'Track train schedules departing from Colombo Fort',
  },
  {
    id: '4',
    route: 'Matara → Colombo',
    line: 'Southern Line',
    vehicle: 'SLTB Luxury (Bus SLTB-01)',
    departs: '03:45 PM',
    duration: '2h 35m',
    type: 'bus',
    query: 'Show me bus schedules from Matara to Colombo',
  },
];

export const QUICK_PROMPTS = [
  { id: '1', title: 'Colombo to Kandy', query: 'What bus options are available from Colombo to Kandy?' },
  { id: '2', title: 'Galle Express Train', query: 'Show me morning train schedules to Galle' },
  { id: '3', title: 'Colombo Fort Status', query: 'Track train schedules departing from Colombo Fort' },
];