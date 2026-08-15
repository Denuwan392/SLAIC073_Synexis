import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, StatusBar, SafeAreaView, ScrollView } from 'react-native';
import { COLORS, TYPOGRAPHY, SPACING, RADIUS, SHADOWS, QUICK_PROMPTS } from '../utils/constants';

export default function HomeScreen({ navigation }: any) {
  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" />
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        
        {/* Top Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.appName}>Synexis</Text>
            <Text style={styles.subTitle}>Smart Transit Companion</Text>
          </View>
          <TouchableOpacity 
            style={styles.settingsBtn}
            onPress={() => navigation.navigate('Settings')}
            activeOpacity={0.7}
          >
            <Text style={styles.settingsIcon}>⚙️</Text>
          </TouchableOpacity>
        </View>

        {/* Main Search Card */}
        <View style={styles.searchCard}>
          <Text style={styles.searchCardTitle}>Ask Transit AI</Text>
          <Text style={styles.searchCardSub}>Find bus routes, train times, and schedules in Sri Lanka.</Text>
          
          <TouchableOpacity 
            style={styles.inputBox}
            onPress={() => navigation.navigate('Chat')}
            activeOpacity={0.8}
          >
            <Text style={styles.searchIcon}>🔍</Text>
            <Text style={styles.placeholder}>Search routes or ask a question...</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.chatBtn}
            onPress={() => navigation.navigate('Chat')}
            activeOpacity={0.8}
          >
            <Text style={styles.chatBtnText}>Start Conversation ➔</Text>
          </TouchableOpacity>
        </View>

        {/* Category Buttons */}
        <View style={styles.categoryRow}>
          <TouchableOpacity 
            style={styles.categoryCard}
            onPress={() => navigation.navigate('Chat')}
            activeOpacity={0.8}
          >
            <Text style={styles.categoryEmoji}>🚌</Text>
            <Text style={styles.categoryTitle}>Bus Schedules</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.categoryCard}
            onPress={() => navigation.navigate('Chat')}
            activeOpacity={0.8}
          >
            <Text style={styles.categoryEmoji}>🚆</Text>
            <Text style={styles.categoryTitle}>Train Schedules</Text>
          </TouchableOpacity>
        </View>

        {/* Popular Routes */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Popular Routes</Text>

          {QUICK_PROMPTS.map((prompt) => (
            <TouchableOpacity
              key={prompt.id}
              style={styles.routeItem}
              onPress={() => navigation.navigate('Chat')}
              activeOpacity={0.7}
            >
              <Text style={styles.routeTitle}>{prompt.title}</Text>
              <Text style={styles.routeArrow}>›</Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Synexis Mobile • Team SLAIC073_Synexis</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  container: {
    flex: 1,
    paddingHorizontal: SPACING.md,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: SPACING.md,
  },
  appName: {
    fontSize: TYPOGRAPHY.fontSize['2xl'],
    fontWeight: TYPOGRAPHY.fontWeight.bold,
    color: COLORS.textPrimary,
  },
  subTitle: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  settingsBtn: {
    width: 40,
    height: 40,
    borderRadius: RADIUS.md,
    backgroundColor: COLORS.surface,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  settingsIcon: {
    fontSize: 18,
  },
  searchCard: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    padding: SPACING.lg,
    marginVertical: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    ...SHADOWS.sm,
  },
  searchCardTitle: {
    fontSize: TYPOGRAPHY.fontSize.lg,
    fontWeight: TYPOGRAPHY.fontWeight.bold,
    color: COLORS.textPrimary,
    marginBottom: 4,
  },
  searchCardSub: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    color: COLORS.textSecondary,
    marginBottom: SPACING.md,
    lineHeight: 20,
  },
  inputBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surfaceSubtle,
    borderRadius: RADIUS.md,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm + 2,
    marginBottom: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  searchIcon: {
    fontSize: 16,
    marginRight: SPACING.sm,
  },
  placeholder: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    color: COLORS.textTertiary,
  },
  chatBtn: {
    backgroundColor: COLORS.primary,
    borderRadius: RADIUS.md,
    paddingVertical: SPACING.sm + 2,
    alignItems: 'center',
  },
  chatBtnText: {
    color: COLORS.textInverse,
    fontSize: TYPOGRAPHY.fontSize.sm,
    fontWeight: TYPOGRAPHY.fontWeight.semibold,
  },
  categoryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: SPACING.lg,
  },
  categoryCard: {
    flex: 0.48,
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
    ...SHADOWS.sm,
  },
  categoryEmoji: {
    fontSize: 28,
    marginBottom: SPACING.xs,
  },
  categoryTitle: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    fontWeight: TYPOGRAPHY.fontWeight.semibold,
    color: COLORS.textPrimary,
  },
  section: {
    marginBottom: SPACING.lg,
  },
  sectionTitle: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    fontWeight: TYPOGRAPHY.fontWeight.bold,
    color: COLORS.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: SPACING.sm,
  },
  routeItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    padding: SPACING.md,
    borderRadius: RADIUS.md,
    marginBottom: SPACING.xs,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  routeTitle: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    color: COLORS.textPrimary,
    fontWeight: TYPOGRAPHY.fontWeight.medium,
  },
  routeArrow: {
    fontSize: TYPOGRAPHY.fontSize.lg,
    color: COLORS.textTertiary,
    fontWeight: 'bold',
  },
  footer: {
    alignItems: 'center',
    paddingVertical: SPACING.lg,
  },
  footerText: {
    fontSize: TYPOGRAPHY.fontSize.xs,
    color: COLORS.textTertiary,
  },
});
