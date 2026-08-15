import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, StatusBar, ScrollView, SafeAreaView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, TYPOGRAPHY, SPACING, RADIUS, SHADOWS, QUICK_PROMPTS } from '../utils/constants';

export default function HomeScreen({ navigation }: any) {
  return (
    <SafeAreaView style={styles.safeContainer}>
      <StatusBar barStyle="dark-content" />
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        
        {/* Custom Top Navigation Bar */}
        <View style={styles.navBar}>
          <View style={styles.brandContainer}>
            <View style={styles.logoBadge}>
              <Text style={styles.logoIcon}>🚌</Text>
            </View>
            <View>
              <Text style={styles.brandTitle}>Synexis AI</Text>
              <View style={styles.statusRow}>
                <View style={styles.onlineDot} />
                <Text style={styles.statusText}>Sri Lanka Transit Live</Text>
              </View>
            </View>
          </View>
          
          <TouchableOpacity 
            style={styles.iconButton}
            onPress={() => navigation.navigate('Settings')}
            activeOpacity={0.7}
          >
            <Text style={styles.iconText}>⚙️</Text>
          </TouchableOpacity>
        </View>

        {/* Hero Banner Section */}
        <LinearGradient
          colors={[COLORS.primary, COLORS.primaryDark]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.heroCard}
        >
          <View style={styles.heroContent}>
            <View style={styles.heroBadge}>
              <Text style={styles.heroBadgeText}>✨ AI Mobility Engine</Text>
            </View>
            <Text style={styles.heroTitle}>Where would you like to travel today?</Text>
            <Text style={styles.heroSubtitle}>
              Island-wide bus routes, live train schedules & multi-lingual AI recommendations.
            </Text>

            {/* Quick Interactive Search Bar */}
            <TouchableOpacity 
              style={styles.searchBar}
              onPress={() => navigation.navigate('Chat')}
              activeOpacity={0.9}
            >
              <Text style={styles.searchIcon}>🔍</Text>
              <Text style={styles.placeholderText}>Search bus or train times...</Text>
              <View style={styles.searchBadge}>
                <Text style={styles.searchBadgeText}>ASK AI</Text>
              </View>
            </TouchableOpacity>
          </View>
        </LinearGradient>

        {/* Main Action Banner */}
        <View style={styles.section}>
          <Text style={styles.sectionHeader}>Quick Actions</Text>
          
          <TouchableOpacity
            style={styles.featuredCard}
            onPress={() => navigation.navigate('Chat')}
            activeOpacity={0.85}
          >
            <LinearGradient
              colors={['#EEF2FF', '#E0E7FF']}
              style={styles.featuredGradient}
            >
              <View style={styles.featuredIconContainer}>
                <Text style={styles.featuredEmoji}>🤖</Text>
              </View>
              <View style={styles.featuredTextContainer}>
                <View style={styles.featuredHeaderRow}>
                  <Text style={styles.featuredTitle}>AI Transit Assistant</Text>
                  <Text style={styles.featuredBadge}>RECOMMENDED</Text>
                </View>
                <Text style={styles.featuredDescription}>
                  Ask natural questions in English, Sinhala, or Tamil for real-time routes.
                </Text>
              </View>
              <Text style={styles.arrowIcon}>➔</Text>
            </LinearGradient>
          </TouchableOpacity>

          {/* Grid Category Cards */}
          <View style={styles.gridRow}>
            <TouchableOpacity
              style={styles.gridCard}
              onPress={() => navigation.navigate('Chat')}
              activeOpacity={0.8}
            >
              <View style={[styles.gridIconBadge, { backgroundColor: '#ECFDF5' }]}>
                <Text style={styles.gridEmoji}>🚌</Text>
              </View>
              <Text style={styles.gridTitle}>Bus Schedules</Text>
              <Text style={styles.gridSub}>Interprovincial & Express</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.gridCard}
              onPress={() => navigation.navigate('Chat')}
              activeOpacity={0.8}
            >
              <View style={[styles.gridIconBadge, { backgroundColor: '#F0F9FF' }]}>
                <Text style={styles.gridEmoji}>🚆</Text>
              </View>
              <Text style={styles.gridTitle}>Train Tracking</Text>
              <Text style={styles.gridSub}>Sri Lanka Railways</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Popular Routes Shortcuts */}
        <View style={styles.section}>
          <View style={styles.sectionTitleRow}>
            <Text style={styles.sectionHeader}>Popular Queries</Text>
            <Text style={styles.seeAll}>Tap to ask</Text>
          </View>

          <View style={styles.promptsContainer}>
            {QUICK_PROMPTS.map((prompt) => (
              <TouchableOpacity
                key={prompt.id}
                style={styles.promptCard}
                onPress={() => navigation.navigate('Chat')}
                activeOpacity={0.7}
              >
                <Text style={styles.promptTitle}>{prompt.title}</Text>
                <Text style={styles.promptArrow}>›</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Footer info */}
        <View style={styles.footer}>
          <Text style={styles.footerBrand}>Synexis Mobile • v1.0.0</Text>
          <Text style={styles.footerText}>Powered by Google Gemini 2.5 AI & ChromaDB</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeContainer: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  container: {
    flex: 1,
    paddingHorizontal: SPACING.md,
  },
  navBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: SPACING.md,
    marginBottom: SPACING.xs,
  },
  brandContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoBadge: {
    width: 40,
    height: 40,
    borderRadius: RADIUS.md,
    backgroundColor: COLORS.primaryGlow,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.sm,
  },
  logoIcon: {
    fontSize: 22,
  },
  brandTitle: {
    fontSize: TYPOGRAPHY.fontSize.lg,
    fontWeight: TYPOGRAPHY.fontWeight.bold,
    color: COLORS.textPrimary,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  onlineDot: {
    width: 7,
    height: 7,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.secondary,
    marginRight: 6,
  },
  statusText: {
    fontSize: 11,
    fontWeight: TYPOGRAPHY.fontWeight.medium,
    color: COLORS.textSecondary,
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: RADIUS.md,
    backgroundColor: COLORS.surface,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
    ...SHADOWS.sm,
  },
  iconText: {
    fontSize: 18,
  },
  heroCard: {
    borderRadius: RADIUS.xl,
    padding: SPACING.lg,
    marginBottom: SPACING.lg,
    ...SHADOWS.lg,
  },
  heroContent: {},
  heroBadge: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: SPACING.sm,
    paddingVertical: 4,
    borderRadius: RADIUS.full,
    marginBottom: SPACING.sm,
  },
  heroBadgeText: {
    fontSize: TYPOGRAPHY.fontSize.xs,
    color: COLORS.textInverse,
    fontWeight: TYPOGRAPHY.fontWeight.semibold,
  },
  heroTitle: {
    fontSize: TYPOGRAPHY.fontSize['2xl'],
    fontWeight: TYPOGRAPHY.fontWeight.bold,
    color: COLORS.textInverse,
    marginBottom: SPACING.xs,
    lineHeight: TYPOGRAPHY.lineHeight.tight * TYPOGRAPHY.fontSize['2xl'],
  },
  heroSubtitle: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    color: 'rgba(255, 255, 255, 0.85)',
    lineHeight: TYPOGRAPHY.lineHeight.normal * TYPOGRAPHY.fontSize.sm,
    marginBottom: SPACING.md,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm + 2,
    ...SHADOWS.md,
  },
  searchIcon: {
    fontSize: 16,
    marginRight: SPACING.sm,
  },
  placeholderText: {
    flex: 1,
    fontSize: TYPOGRAPHY.fontSize.sm,
    color: COLORS.textTertiary,
    fontWeight: TYPOGRAPHY.fontWeight.regular,
  },
  searchBadge: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: SPACING.sm,
    paddingVertical: 4,
    borderRadius: RADIUS.sm,
  },
  searchBadgeText: {
    fontSize: 10,
    fontWeight: TYPOGRAPHY.fontWeight.bold,
    color: COLORS.textInverse,
  },
  section: {
    marginBottom: SPACING.lg,
  },
  sectionTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  sectionHeader: {
    fontSize: TYPOGRAPHY.fontSize.base,
    fontWeight: TYPOGRAPHY.fontWeight.bold,
    color: COLORS.textPrimary,
    marginBottom: SPACING.sm,
  },
  seeAll: {
    fontSize: TYPOGRAPHY.fontSize.xs,
    color: COLORS.primary,
    fontWeight: TYPOGRAPHY.fontWeight.semibold,
  },
  featuredCard: {
    borderRadius: RADIUS.lg,
    overflow: 'hidden',
    marginBottom: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.primaryLight + '40',
    ...SHADOWS.md,
  },
  featuredGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.md,
  },
  featuredIconContainer: {
    width: 46,
    height: 46,
    borderRadius: RADIUS.md,
    backgroundColor: COLORS.surface,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.md,
    ...SHADOWS.sm,
  },
  featuredEmoji: {
    fontSize: 24,
  },
  featuredTextContainer: {
    flex: 1,
  },
  featuredHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 2,
  },
  featuredTitle: {
    fontSize: TYPOGRAPHY.fontSize.base,
    fontWeight: TYPOGRAPHY.fontWeight.bold,
    color: COLORS.textPrimary,
    marginRight: SPACING.xs,
  },
  featuredBadge: {
    fontSize: 9,
    fontWeight: TYPOGRAPHY.fontWeight.bold,
    color: COLORS.primary,
    backgroundColor: COLORS.primary + '15',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: RADIUS.xs,
  },
  featuredDescription: {
    fontSize: TYPOGRAPHY.fontSize.xs,
    color: COLORS.textSecondary,
    lineHeight: TYPOGRAPHY.lineHeight.normal * TYPOGRAPHY.fontSize.xs,
  },
  arrowIcon: {
    fontSize: 18,
    color: COLORS.primary,
    fontWeight: 'bold',
    marginLeft: SPACING.xs,
  },
  gridRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  gridCard: {
    flex: 0.485,
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    ...SHADOWS.sm,
  },
  gridIconBadge: {
    width: 44,
    height: 44,
    borderRadius: RADIUS.md,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  gridEmoji: {
    fontSize: 22,
  },
  gridTitle: {
    fontSize: TYPOGRAPHY.fontSize.base,
    fontWeight: TYPOGRAPHY.fontWeight.bold,
    color: COLORS.textPrimary,
    marginBottom: 2,
  },
  gridSub: {
    fontSize: TYPOGRAPHY.fontSize.xs,
    color: COLORS.textSecondary,
  },
  promptsContainer: {
    gap: SPACING.sm,
  },
  promptCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    padding: SPACING.md,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    ...SHADOWS.sm,
  },
  promptTitle: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    fontWeight: TYPOGRAPHY.fontWeight.semibold,
    color: COLORS.textPrimary,
  },
  promptArrow: {
    fontSize: TYPOGRAPHY.fontSize.lg,
    color: COLORS.textTertiary,
    fontWeight: 'bold',
  },
  footer: {
    alignItems: 'center',
    paddingVertical: SPACING.xl,
  },
  footerBrand: {
    fontSize: TYPOGRAPHY.fontSize.xs,
    fontWeight: TYPOGRAPHY.fontWeight.semibold,
    color: COLORS.textSecondary,
    marginBottom: 2,
  },
  footerText: {
    fontSize: 11,
    color: COLORS.textTertiary,
  },
});
