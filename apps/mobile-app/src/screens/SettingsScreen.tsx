import React, { useState } from 'react';
import { View, Text, StyleSheet, Switch, ScrollView, TouchableOpacity, StatusBar, SafeAreaView } from 'react-native';
import { COLORS, TYPOGRAPHY, SPACING, RADIUS, SUPPORTED_LANGUAGES } from '../utils/constants';

export default function SettingsScreen({ navigation }: any) {
  const [notifications, setNotifications] = useState(true);
  const [autoTranslate, setAutoTranslate] = useState(true);
  const [selectedLang, setSelectedLang] = useState('en');

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.background} />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backBtn}
          onPress={() => navigation.goBack()}
          activeOpacity={0.7}
        >
          <Text style={styles.backIcon}>‹</Text>
          <Text style={styles.backText}>Home</Text>
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Settings</Text>
        <View style={{ width: 60 }} />
      </View>

      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        
        {/* Settings Group */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>PREFERENCES</Text>

          <View style={styles.card}>
            <View style={styles.row}>
              <View style={styles.rowInfo}>
                <Text style={styles.rowTitle}>Notifications & Alerts</Text>
                <Text style={styles.rowSub}>Schedule updates & departure alerts</Text>
              </View>
              <Switch
                trackColor={{ false: COLORS.surfaceSubtle, true: 'rgba(0, 242, 254, 0.4)' }}
                thumbColor={notifications ? COLORS.cyan : '#64748B'}
                onValueChange={setNotifications}
                value={notifications}
              />
            </View>

            <View style={styles.divider} />

            <View style={styles.row}>
              <View style={styles.rowInfo}>
                <Text style={styles.rowTitle}>Auto Translate AI</Text>
                <Text style={styles.rowSub}>Support Sinhala & Tamil queries</Text>
              </View>
              <Switch
                trackColor={{ false: COLORS.surfaceSubtle, true: 'rgba(0, 242, 254, 0.4)' }}
                thumbColor={autoTranslate ? COLORS.cyan : '#64748B'}
                onValueChange={setAutoTranslate}
                value={autoTranslate}
              />
            </View>
          </View>
        </View>

        {/* Language Selection */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>LANGUAGE SELECTION</Text>

          <View style={styles.card}>
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
          <Text style={styles.sectionTitle}>SYSTEM SPECIFICATIONS</Text>
          <View style={styles.card}>
            <View style={styles.aboutRow}>
              <Text style={styles.appName}>Synexis Mobile</Text>
              <Text style={styles.appVersion}>v1.0.0 Production</Text>
            </View>
            <Text style={styles.aboutDesc}>
              Powered by LangGraph Agent RAG & ChromaDB Vector Engine.
            </Text>
          </View>
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm + 2,
    backgroundColor: COLORS.surface,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  backBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    width: 60,
  },
  backIcon: {
    fontSize: 24,
    color: COLORS.cyan,
    fontWeight: 'bold',
    marginTop: -2,
  },
  backText: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    color: COLORS.cyan,
    fontWeight: TYPOGRAPHY.fontWeight.semibold,
  },
  headerTitle: {
    fontSize: TYPOGRAPHY.fontSize.base,
    fontWeight: TYPOGRAPHY.fontWeight.bold,
    color: COLORS.textPrimary,
  },
  container: {
    flex: 1,
    paddingHorizontal: SPACING.md,
    paddingTop: SPACING.md,
  },
  section: {
    marginBottom: SPACING.lg,
  },
  sectionTitle: {
    fontSize: 10,
    fontWeight: TYPOGRAPHY.fontWeight.bold,
    color: COLORS.textSecondary,
    letterSpacing: 1,
    marginBottom: SPACING.xs,
    marginLeft: 2,
  },
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    overflow: 'hidden',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.md,
  },
  rowInfo: {
    flex: 1,
    marginRight: SPACING.sm,
  },
  rowTitle: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    fontWeight: TYPOGRAPHY.fontWeight.semibold,
    color: COLORS.textPrimary,
    marginBottom: 2,
  },
  rowSub: {
    fontSize: TYPOGRAPHY.fontSize.xs,
    color: COLORS.textSecondary,
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.border,
    marginLeft: SPACING.md,
  },
  langRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.md,
  },
  langFlag: {
    fontSize: 18,
    marginRight: SPACING.md,
  },
  langName: {
    flex: 1,
    fontSize: TYPOGRAPHY.fontSize.sm,
    color: COLORS.textPrimary,
    fontWeight: TYPOGRAPHY.fontWeight.medium,
  },
  checkMark: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    fontWeight: 'bold',
    color: COLORS.cyan,
  },
  aboutRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: SPACING.md,
    paddingBottom: 4,
  },
  appName: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    fontWeight: TYPOGRAPHY.fontWeight.bold,
    color: COLORS.textPrimary,
  },
  appVersion: {
    fontSize: TYPOGRAPHY.fontSize.xs,
    color: COLORS.cyan,
  },
  aboutDesc: {
    fontSize: TYPOGRAPHY.fontSize.xs,
    color: COLORS.textSecondary,
    paddingHorizontal: SPACING.md,
    paddingBottom: SPACING.md,
  },
});
