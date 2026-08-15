import React, { useState } from 'react';
import { View, Text, StyleSheet, Switch, ScrollView, TouchableOpacity, StatusBar, SafeAreaView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, TYPOGRAPHY, SPACING, RADIUS, SHADOWS, SUPPORTED_LANGUAGES } from '../utils/constants';

export default function SettingsScreen({ navigation }: any) {
  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [autoTranslate, setAutoTranslate] = useState(true);
  const [selectedLang, setSelectedLang] = useState('en');

  return (
    <SafeAreaView style={styles.safeContainer}>
      <StatusBar barStyle="dark-content" />
      
      {/* Custom Navigation Header */}
      <View style={styles.headerBar}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
          activeOpacity={0.7}
        >
          <Text style={styles.backIcon}>‹</Text>
          <Text style={styles.backText}>Home</Text>
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Settings</Text>
        <View style={{ width: 50 }} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        
        {/* User Hero Banner */}
        <LinearGradient
          colors={[COLORS.primary, COLORS.primaryDark]}
          style={styles.profileBanner}
        >
          <View style={styles.avatarCircle}>
            <Text style={styles.avatarEmoji}>🚌</Text>
          </View>
          <View style={styles.profileText}>
            <Text style={styles.profileName}>Synexis Mobile App</Text>
            <Text style={styles.profileSub}>Team SLAIC073_Synexis • Sri Lanka</Text>
          </View>
        </LinearGradient>

        {/* Notifications Group */}
        <View style={styles.section}>
          <Text style={styles.sectionHeader}>Preferences</Text>

          <View style={styles.groupedCard}>
            <View style={styles.settingRow}>
              <View style={[styles.iconBadge, { backgroundColor: '#EEF2FF' }]}>
                <Text style={styles.iconEmoji}>🔔</Text>
              </View>
              <View style={styles.settingInfo}>
                <Text style={styles.settingTitle}>Push Notifications</Text>
                <Text style={styles.settingSub}>Alerts for schedule updates & delay tracking</Text>
              </View>
              <Switch
                trackColor={{ false: COLORS.border, true: COLORS.primaryLight }}
                thumbColor={notifications ? COLORS.primary : '#94A3B8'}
                onValueChange={setNotifications}
                value={notifications}
              />
            </View>

            <View style={styles.divider} />

            <View style={styles.settingRow}>
              <View style={[styles.iconBadge, { backgroundColor: '#F0FDF4' }]}>
                <Text style={styles.iconEmoji}>🌐</Text>
              </View>
              <View style={styles.settingInfo}>
                <Text style={styles.settingTitle}>Trilingual NLU Translation</Text>
                <Text style={styles.settingSub}>Auto-translate Sinhala, Tamil, & English queries</Text>
              </View>
              <Switch
                trackColor={{ false: COLORS.border, true: COLORS.primaryLight }}
                thumbColor={autoTranslate ? COLORS.primary : '#94A3B8'}
                onValueChange={setAutoTranslate}
                value={autoTranslate}
              />
            </View>
          </View>
        </View>

        {/* Appearance Section */}
        <View style={styles.section}>
          <Text style={styles.sectionHeader}>Appearance</Text>

          <View style={styles.groupedCard}>
            <View style={styles.settingRow}>
              <View style={[styles.iconBadge, { backgroundColor: '#F3E8FF' }]}>
                <Text style={styles.iconEmoji}>🌙</Text>
              </View>
              <View style={styles.settingInfo}>
                <Text style={styles.settingTitle}>Dark Theme</Text>
                <Text style={styles.settingSub}>OLED dark layout (Automatic system mode)</Text>
              </View>
              <Switch
                trackColor={{ false: COLORS.border, true: COLORS.primaryLight }}
                thumbColor={darkMode ? COLORS.primary : '#94A3B8'}
                onValueChange={setDarkMode}
                value={darkMode}
              />
            </View>
          </View>
        </View>

        {/* Active Language Picker */}
        <View style={styles.section}>
          <Text style={styles.sectionHeader}>Primary Language</Text>

          <View style={styles.groupedCard}>
            {SUPPORTED_LANGUAGES.map((lang, index) => (
              <React.Fragment key={lang.code}>
                {index > 0 && <View style={styles.divider} />}
                <TouchableOpacity 
                  style={styles.langRow}
                  onPress={() => setSelectedLang(lang.code)}
                  activeOpacity={0.7}
                >
                  <Text style={styles.langFlag}>{lang.flag}</Text>
                  <Text style={styles.langName}>{lang.name}</Text>
                  {selectedLang === lang.code && (
                    <Text style={styles.checkMark}>✓</Text>
                  )}
                </TouchableOpacity>
              </React.Fragment>
            ))}
          </View>
        </View>

        {/* System & Architecture Info */}
        <View style={styles.section}>
          <Text style={styles.sectionHeader}>About Platform</Text>

          <View style={styles.aboutCard}>
            <View style={styles.appLogoRow}>
              <Text style={styles.appLogoEmoji}>🚌</Text>
              <View>
                <Text style={styles.appName}>Synexis Mobile</Text>
                <Text style={styles.appVersion}>Version 1.0.0 (Release Build)</Text>
              </View>
            </View>

            <Text style={styles.aboutDescription}>
              NEED TO GO — Smart Multi-Modal Transit Assistant for Sri Lankan bus routes and railways.
            </Text>

            <View style={styles.techPills}>
              <View style={styles.techPill}><Text style={styles.techPillText}>React Native</Text></View>
              <View style={styles.techPill}><Text style={styles.techPillText}>Expo SDK 54</Text></View>
              <View style={styles.techPill}><Text style={styles.techPillText}>FastAPI</Text></View>
              <View style={styles.techPill}><Text style={styles.techPillText}>Gemini 2.5</Text></View>
            </View>
          </View>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Developed by Team SLAIC073_Synexis</Text>
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
  headerBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    backgroundColor: COLORS.surface,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    ...SHADOWS.sm,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    width: 60,
  },
  backIcon: {
    fontSize: 28,
    color: COLORS.primary,
    fontWeight: 'bold',
    marginTop: -2,
  },
  backText: {
    fontSize: TYPOGRAPHY.fontSize.base,
    color: COLORS.primary,
    fontWeight: TYPOGRAPHY.fontWeight.medium,
  },
  headerTitle: {
    fontSize: TYPOGRAPHY.fontSize.base,
    fontWeight: TYPOGRAPHY.fontWeight.bold,
    color: COLORS.textPrimary,
  },
  content: {
    flex: 1,
    paddingHorizontal: SPACING.md,
  },
  profileBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    marginVertical: SPACING.md,
    ...SHADOWS.md,
  },
  avatarCircle: {
    width: 48,
    height: 48,
    borderRadius: RADIUS.full,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.md,
  },
  avatarEmoji: {
    fontSize: 24,
  },
  profileText: {
    flex: 1,
  },
  profileName: {
    fontSize: TYPOGRAPHY.fontSize.base,
    fontWeight: TYPOGRAPHY.fontWeight.bold,
    color: COLORS.textInverse,
  },
  profileSub: {
    fontSize: TYPOGRAPHY.fontSize.xs,
    color: COLORS.primaryLight,
    marginTop: 2,
  },
  section: {
    marginBottom: SPACING.lg,
  },
  sectionHeader: {
    fontSize: TYPOGRAPHY.fontSize.xs,
    fontWeight: TYPOGRAPHY.fontWeight.bold,
    color: COLORS.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.6,
    marginBottom: SPACING.xs,
    marginLeft: SPACING.xs,
  },
  groupedCard: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
    overflow: 'hidden',
    ...SHADOWS.sm,
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.md,
  },
  iconBadge: {
    width: 36,
    height: 36,
    borderRadius: RADIUS.md,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.md,
  },
  iconEmoji: {
    fontSize: 18,
  },
  settingInfo: {
    flex: 1,
    marginRight: SPACING.sm,
  },
  settingTitle: {
    fontSize: TYPOGRAPHY.fontSize.base,
    fontWeight: TYPOGRAPHY.fontWeight.semibold,
    color: COLORS.textPrimary,
    marginBottom: 2,
  },
  settingSub: {
    fontSize: TYPOGRAPHY.fontSize.xs,
    color: COLORS.textSecondary,
    lineHeight: TYPOGRAPHY.lineHeight.normal * TYPOGRAPHY.fontSize.xs,
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.borderLight,
    marginLeft: 60,
  },
  langRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.md,
  },
  langFlag: {
    fontSize: 20,
    marginRight: SPACING.md,
  },
  langName: {
    flex: 1,
    fontSize: TYPOGRAPHY.fontSize.base,
    fontWeight: TYPOGRAPHY.fontWeight.medium,
    color: COLORS.textPrimary,
  },
  checkMark: {
    fontSize: TYPOGRAPHY.fontSize.base,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  aboutCard: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    padding: SPACING.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
    ...SHADOWS.sm,
  },
  appLogoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  appLogoEmoji: {
    fontSize: 32,
    marginRight: SPACING.md,
  },
  appName: {
    fontSize: TYPOGRAPHY.fontSize.lg,
    fontWeight: TYPOGRAPHY.fontWeight.bold,
    color: COLORS.textPrimary,
  },
  appVersion: {
    fontSize: TYPOGRAPHY.fontSize.xs,
    color: COLORS.textSecondary,
  },
  aboutDescription: {
    fontSize: TYPOGRAPHY.fontSize.xs,
    color: COLORS.textSecondary,
    lineHeight: TYPOGRAPHY.lineHeight.normal * TYPOGRAPHY.fontSize.xs,
    marginBottom: SPACING.md,
  },
  techPills: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.xs,
  },
  techPill: {
    backgroundColor: COLORS.surfaceSubtle,
    paddingHorizontal: SPACING.sm,
    paddingVertical: 4,
    borderRadius: RADIUS.sm,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  techPillText: {
    fontSize: 10,
    fontWeight: TYPOGRAPHY.fontWeight.semibold,
    color: COLORS.textSecondary,
  },
  footer: {
    alignItems: 'center',
    paddingVertical: SPACING.lg,
  },
  footerText: {
    fontSize: TYPOGRAPHY.fontSize.xs,
    color: COLORS.textTertiary,
    fontWeight: TYPOGRAPHY.fontWeight.medium,
  },
});
