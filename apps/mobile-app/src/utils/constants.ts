export const API_BASE_URL = 'http://10.10.11.13:8000'; // Mac LAN IP for iPhone / physical device testing

export const DEFAULT_LANGUAGE = 'en'; // Default language for the app

export const SUPPORTED_LANGUAGES = ['en', 'si', 'ta']; // Supported languages: English, Sinhala, Tamil

export const CHATBOT_NAME = 'Smart Transit Assistant'; // Name of the chatbot

export const MAX_MESSAGE_LENGTH = 500; // Maximum length for user messages

export const TIMEOUT_DURATION = 5000; // Timeout duration for API requests in milliseconds

export const ERROR_MESSAGES = {
    NETWORK_ERROR: 'Network error. Please try again later.',
    INVALID_INPUT: 'Invalid input. Please check your message.',
    API_ERROR: 'An error occurred while communicating with the server.',
}; // Common error messages used in the app

// Professional Color Palette
export const COLORS = {
    // Primary Colors
    primary: '#2563EB', // Modern blue
    primaryDark: '#1E40AF',
    primaryLight: '#60A5FA',
    
    // Secondary Colors
    secondary: '#10B981', // Success green
    secondaryDark: '#059669',
    secondaryLight: '#34D399',
    
    // Accent Colors
    accent: '#8B5CF6', // Purple
    accentLight: '#A78BFA',
    
    // Neutral Colors
    background: '#F8FAFC',
    backgroundDark: '#F1F5F9',
    surface: '#FFFFFF',
    
    // Text Colors
    textPrimary: '#1E293B',
    textSecondary: '#64748B',
    textTertiary: '#94A3B8',
    textInverse: '#FFFFFF',
    
    // Message Colors
    userMessage: '#2563EB',
    botMessage: '#FFFFFF',
    userMessageText: '#FFFFFF',
    botMessageText: '#1E293B',
    
    // Status Colors
    success: '#10B981',
    warning: '#F59E0B',
    error: '#EF4444',
    info: '#3B82F6',
    
    // Border Colors
    border: '#E2E8F0',
    borderLight: '#F1F5F9',
    
    // Shadow
    shadow: '#000000',
};

// Typography
export const TYPOGRAPHY = {
    // Font Sizes
    fontSize: {
        xs: 12,
        sm: 14,
        base: 16,
        lg: 18,
        xl: 20,
        '2xl': 24,
        '3xl': 30,
        '4xl': 36,
    },
    
    // Font Weights
    fontWeight: {
        regular: '400' as const,
        medium: '500' as const,
        semibold: '600' as const,
        bold: '700' as const,
    },
    
    // Line Heights
    lineHeight: {
        tight: 1.2,
        normal: 1.5,
        relaxed: 1.75,
    },
};

// Spacing
export const SPACING = {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    '2xl': 48,
};

// Border Radius
export const RADIUS = {
    sm: 8,
    md: 12,
    lg: 16,
    xl: 24,
    full: 9999,
};

// Shadows
export const SHADOWS = {
    sm: {
        shadowColor: COLORS.shadow,
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 2,
    },
    md: {
        shadowColor: COLORS.shadow,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 4,
    },
    lg: {
        shadowColor: COLORS.shadow,
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.15,
        shadowRadius: 16,
        elevation: 8,
    },
};