export const API_BASE_URL = 'http://localhost:8000';

export const DEFAULT_LANGUAGE = 'en';

export const SUPPORTED_LANGUAGES = [
  { code: 'en', name: 'English', flag: '🇬🇧' },
  { code: 'si', name: 'සිංහල', flag: '🇱🇰' },
  { code: 'ta', name: 'தமிழ்', flag: '🇱🇰' }
];

export const CHATBOT_NAME = 'Synexis AI';
export const MAX_MESSAGE_LENGTH = 500;
export const TIMEOUT_DURATION = 8000;

export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Network issue detected. Please check connection.',
  INVALID_INPUT: 'Invalid query input. Please try again.',
  API_ERROR: 'Unable to process transit request.',
};

// Signature Synexis Obsidian & Electric Cyan Palette (Bespoke Production UI)
export const COLORS = {
  // Brand Canvas
  background: '#0B0F19',       // Deep Obsidian
  surface: '#151C2C',          // Elevated Card Slate
  surfaceSubtle: '#1E293B',    // Dark Pill Fill
  surfaceHighlight: '#26334D', // Active Hover Fill
  
  // Accents
  cyan: '#00F2FE',             // Synexis Electric Cyan
  cyanGlow: 'rgba(0, 242, 254, 0.15)',
  emerald: '#10B981',          // On-Time Green
  amber: '#F59E0B',            // Express Bus Amber
  purple: '#8B5CF6',           // Special Express
  
  primary: '#00F2FE',          // Primary Action
  primaryDark: '#0284C7',
  primaryLight: '#38BDF8',
  
  // Line Badges
  coastalBadgeBg: 'rgba(2, 132, 199, 0.2)',
  coastalBadgeText: '#38BDF8',
  
  mainLineBadgeBg: 'rgba(13, 148, 136, 0.2)',
  mainLineBadgeText: '#2DD4BF',
  
  expressBusBadgeBg: 'rgba(217, 119, 6, 0.2)',
  expressBusBadgeText: '#FBBF24',

  normalBusBadgeBg: 'rgba(16, 185, 129, 0.2)',
  normalBusBadgeText: '#34D399',
  
  // Text Hierarchy
  textPrimary: '#F8FAFC',       // Pure Crisp White
  textSecondary: '#94A3B8',     // Muted Blue-Grey
  textTertiary: '#64748B',      // Dimmed Grey
  textInverse: '#0B0F19',
  
  userMessage: '#0284C7',
  botMessage: '#151C2C',
  userMessageText: '#FFFFFF',
  botMessageText: '#F8FAFC',
  
  // Borders
  border: 'rgba(255, 255, 255, 0.08)',
  borderActive: 'rgba(0, 242, 254, 0.3)',
  
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
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 3,
  },
  md: {
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 6,
  },
};

export const SIGNATURE_DEPARTURES = [
  {
    id: '1',
    route: 'Colombo Fort ➔ Galle',
    line: 'Coastal Line',
    vehicle: 'Ruhunu Kumari (Train 8058)',
    departs: '06:30 AM',
    status: 'ON TIME',
    type: 'train',
    badgeBg: COLORS.coastalBadgeBg,
    badgeColor: COLORS.coastalBadgeText,
    query: 'Show me morning train schedules to Galle',
  },
  {
    id: '2',
    route: 'Colombo ➔ Kandy',
    line: 'Central Expressway',
    vehicle: 'Expressway Luxury (Bus EX-1)',
    departs: '07:00 AM',
    status: 'FREQUENCY 30M',
    type: 'bus',
    badgeBg: COLORS.expressBusBadgeBg,
    badgeColor: COLORS.expressBusBadgeText,
    query: 'What bus options are available from Colombo to Kandy?',
  },
  {
    id: '3',
    route: 'Colombo Fort ➔ Badulla',
    line: 'Main Line',
    vehicle: 'Podi Menike (Train 1005)',
    departs: '05:55 AM',
    status: 'ON TIME',
    type: 'train',
    badgeBg: COLORS.mainLineBadgeBg,
    badgeColor: COLORS.mainLineBadgeText,
    query: 'Track train schedules departing from Colombo Fort',
  },
  {
    id: '4',
    route: 'Matara ➔ Colombo',
    line: 'Southern Line',
    vehicle: 'SLTB Luxury (Bus SLTB-01)',
    departs: '03:45 PM',
    status: 'DAILY',
    type: 'bus',
    badgeBg: COLORS.normalBusBadgeBg,
    badgeColor: COLORS.normalBusBadgeText,
    query: 'Show me bus schedules from Matara to Colombo',
  },
];

export const QUICK_PROMPTS = [
  { id: '1', title: 'Colombo to Kandy', query: 'What bus options are available from Colombo to Kandy?' },
  { id: '2', title: 'Galle Express Train', query: 'Show me morning train schedules to Galle' },
  { id: '3', title: 'Colombo Fort Status', query: 'Track train schedules departing from Colombo Fort' },
];