import React, { useState } from 'react';
import { View, Text, StyleSheet, Switch, ScrollView, TouchableOpacity, StatusBar } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, TYPOGRAPHY, SPACING, RADIUS, SHADOWS } from '../utils/constants';

export default function SettingsScreen() {
    const [notifications, setNotifications] = useState(true);
    const [darkMode, setDarkMode] = useState(false);
    const [autoTranslate, setAutoTranslate] = useState(false);

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" />
            
            {/* Header */}
            <LinearGradient
                colors={[COLORS.primary, COLORS.primaryDark]}
                style={styles.header}
            >
                <Text style={styles.headerTitle}>⚙️ Settings</Text>
                <Text style={styles.headerSubtitle}>Customize your experience</Text>
            </LinearGradient>

            <ScrollView style={styles.content}>
                {/* Notifications Section */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Notifications</Text>
                    
                    <View style={styles.settingCard}>
                        <View style={styles.settingInfo}>
                            <Text style={styles.settingTitle}>🔔 Push Notifications</Text>
                            <Text style={styles.settingDescription}>
                                Receive updates about your queries
                            </Text>
                        </View>
                        <Switch
                            trackColor={{ false: COLORS.border, true: COLORS.primaryLight }}
                            thumbColor={notifications ? COLORS.primary : COLORS.textTertiary}
                            onValueChange={setNotifications}
                            value={notifications}
                        />
                    </View>
                </View>

                {/* Appearance Section */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Appearance</Text>
                    
                    <View style={styles.settingCard}>
                        <View style={styles.settingInfo}>
                            <Text style={styles.settingTitle}>🌙 Dark Mode</Text>
                            <Text style={styles.settingDescription}>
                                Switch to dark theme (Coming soon)
                            </Text>
                        </View>
                        <Switch
                            trackColor={{ false: COLORS.border, true: COLORS.primaryLight }}
                            thumbColor={darkMode ? COLORS.primary : COLORS.textTertiary}
                            onValueChange={setDarkMode}
                            value={darkMode}
                            disabled
                        />
                    </View>
                </View>

                {/* Language Section */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Language</Text>
                    
                    <View style={styles.settingCard}>
                        <View style={styles.settingInfo}>
                            <Text style={styles.settingTitle}>🌐 Auto-translate</Text>
                            <Text style={styles.settingDescription}>
                                Automatically detect and translate messages
                            </Text>
                        </View>
                        <Switch
                            trackColor={{ false: COLORS.border, true: COLORS.primaryLight }}
                            thumbColor={autoTranslate ? COLORS.primary : COLORS.textTertiary}
                            onValueChange={setAutoTranslate}
                            value={autoTranslate}
                        />
                    </View>

                    <TouchableOpacity style={styles.languageButton}>
                        <Text style={styles.languageButtonText}>🇬🇧 English</Text>
                        <Text style={styles.languageChevron}>›</Text>
                    </TouchableOpacity>
                </View>

                {/* About Section */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>About</Text>
                    
                    <View style={styles.aboutCard}>
                        <Text style={styles.appName}>🚌 Synexis</Text>
                        <Text style={styles.version}>Version 1.0.0</Text>
                        <Text style={styles.description}>
                            Smart Transit Companion for Sri Lanka
                        </Text>
                        <Text style={styles.poweredBy}>
                            Powered by Google Gemini AI
                        </Text>
                    </View>
                </View>

                <View style={styles.footer}>
                    <Text style={styles.footerText}>
                        Made with ❤️ for Sri Lankan travelers
                    </Text>
                </View>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
    },
    header: {
        paddingTop: SPACING.xl + 20,
        paddingBottom: SPACING.lg,
        paddingHorizontal: SPACING.lg,
    },
    headerTitle: {
        fontSize: TYPOGRAPHY.fontSize['2xl'],
        fontWeight: TYPOGRAPHY.fontWeight.bold,
        color: COLORS.textInverse,
        marginBottom: SPACING.xs / 2,
    },
    headerSubtitle: {
        fontSize: TYPOGRAPHY.fontSize.sm,
        color: COLORS.primaryLight,
        fontWeight: TYPOGRAPHY.fontWeight.medium,
    },
    content: {
        flex: 1,
    },
    section: {
        paddingHorizontal: SPACING.lg,
        paddingTop: SPACING.lg,
    },
    sectionTitle: {
        fontSize: TYPOGRAPHY.fontSize.sm,
        fontWeight: TYPOGRAPHY.fontWeight.bold,
        color: COLORS.textSecondary,
        textTransform: 'uppercase',
        letterSpacing: 0.5,
        marginBottom: SPACING.sm,
    },
    settingCard: {
        backgroundColor: COLORS.surface,
        borderRadius: RADIUS.md,
        padding: SPACING.md,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: SPACING.sm,
        ...SHADOWS.sm,
    },
    settingInfo: {
        flex: 1,
        marginRight: SPACING.md,
    },
    settingTitle: {
        fontSize: TYPOGRAPHY.fontSize.base,
        fontWeight: TYPOGRAPHY.fontWeight.semibold,
        color: COLORS.textPrimary,
        marginBottom: SPACING.xs / 2,
    },
    settingDescription: {
        fontSize: TYPOGRAPHY.fontSize.sm,
        color: COLORS.textSecondary,
        lineHeight: TYPOGRAPHY.lineHeight.normal * TYPOGRAPHY.fontSize.sm,
    },
    languageButton: {
        backgroundColor: COLORS.surface,
        borderRadius: RADIUS.md,
        padding: SPACING.md,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        ...SHADOWS.sm,
    },
    languageButtonText: {
        fontSize: TYPOGRAPHY.fontSize.base,
        fontWeight: TYPOGRAPHY.fontWeight.semibold,
        color: COLORS.textPrimary,
    },
    languageChevron: {
        fontSize: TYPOGRAPHY.fontSize.xl,
        color: COLORS.textTertiary,
        fontWeight: TYPOGRAPHY.fontWeight.bold,
    },
    aboutCard: {
        backgroundColor: COLORS.surface,
        borderRadius: RADIUS.md,
        padding: SPACING.lg,
        alignItems: 'center',
        ...SHADOWS.sm,
    },
    appName: {
        fontSize: TYPOGRAPHY.fontSize['2xl'],
        fontWeight: TYPOGRAPHY.fontWeight.bold,
        color: COLORS.primary,
        marginBottom: SPACING.xs,
    },
    version: {
        fontSize: TYPOGRAPHY.fontSize.sm,
        color: COLORS.textSecondary,
        marginBottom: SPACING.md,
    },
    description: {
        fontSize: TYPOGRAPHY.fontSize.base,
        color: COLORS.textPrimary,
        textAlign: 'center',
        marginBottom: SPACING.sm,
    },
    poweredBy: {
        fontSize: TYPOGRAPHY.fontSize.sm,
        color: COLORS.textSecondary,
        fontWeight: TYPOGRAPHY.fontWeight.medium,
    },
    footer: {
        padding: SPACING.xl,
        alignItems: 'center',
    },
    footerText: {
        fontSize: TYPOGRAPHY.fontSize.sm,
        color: COLORS.textSecondary,
        textAlign: 'center',
    },
});
