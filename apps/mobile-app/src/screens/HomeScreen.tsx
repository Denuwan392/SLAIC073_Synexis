import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, StatusBar } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, TYPOGRAPHY, SPACING, RADIUS, SHADOWS } from '../utils/constants';

export default function HomeScreen({ navigation }: any) {
    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" />
            <LinearGradient
                colors={[COLORS.primary, COLORS.primaryDark]}
                style={styles.gradient}
            >
                {/* Header Section */}
                <View style={styles.header}>
                    <Text style={styles.appName}>🚌 Synexis</Text>
                    <Text style={styles.tagline}>Smart Transit Companion</Text>
                </View>

                {/* Content Section */}
                <View style={styles.content}>
                    <View style={styles.welcomeCard}>
                        <Text style={styles.welcomeTitle}>Welcome Back! 👋</Text>
                        <Text style={styles.welcomeText}>
                            Your personal AI assistant for bus and train schedules in Sri Lanka
                        </Text>
                    </View>

                    {/* Action Cards */}
                    <View style={styles.cardsContainer}>
                        <TouchableOpacity
                            style={styles.primaryCard}
                            onPress={() => navigation.navigate('Chat')}
                            activeOpacity={0.8}
                        >
                            <View style={styles.cardIcon}>
                                <Text style={styles.cardEmoji}>💬</Text>
                            </View>
                            <Text style={styles.primaryCardTitle}>Chat with AI Assistant</Text>
                            <Text style={styles.primaryCardDescription}>
                                Ask about bus times, train schedules, and routes
                            </Text>
                        </TouchableOpacity>

                        <View style={styles.row}>
                            <TouchableOpacity
                                style={styles.secondaryCard}
                                onPress={() => navigation.navigate('Chat')}
                                activeOpacity={0.8}
                            >
                                <View style={styles.smallCardIcon}>
                                    <Text style={styles.smallCardEmoji}>🚌</Text>
                                </View>
                                <Text style={styles.secondaryCardTitle}>Bus Schedules</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={styles.secondaryCard}
                                onPress={() => navigation.navigate('Chat')}
                                activeOpacity={0.8}
                            >
                                <View style={styles.smallCardIcon}>
                                    <Text style={styles.smallCardEmoji}>🚆</Text>
                                </View>
                                <Text style={styles.secondaryCardTitle}>Train Times</Text>
                            </TouchableOpacity>
                        </View>

                        <TouchableOpacity
                            style={styles.settingsButton}
                            onPress={() => navigation.navigate('Settings')}
                            activeOpacity={0.8}
                        >
                            <Text style={styles.settingsButtonText}>⚙️ Settings</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Footer */}
                <View style={styles.footer}>
                    <Text style={styles.footerText}>Powered by Gemini AI</Text>
                </View>
            </LinearGradient>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.primary,
    },
    gradient: {
        flex: 1,
    },
    header: {
        paddingTop: SPACING.xl + 20,
        paddingHorizontal: SPACING.lg,
        alignItems: 'center',
    },
    appName: {
        fontSize: TYPOGRAPHY.fontSize['4xl'],
        fontWeight: TYPOGRAPHY.fontWeight.bold,
        color: COLORS.textInverse,
        marginBottom: SPACING.xs,
    },
    tagline: {
        fontSize: TYPOGRAPHY.fontSize.base,
        color: COLORS.primaryLight,
        fontWeight: TYPOGRAPHY.fontWeight.medium,
    },
    content: {
        flex: 1,
        paddingHorizontal: SPACING.lg,
        paddingTop: SPACING.xl,
    },
    welcomeCard: {
        backgroundColor: 'rgba(255, 255, 255, 0.15)',
        borderRadius: RADIUS.lg,
        padding: SPACING.lg,
        marginBottom: SPACING.lg,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.2)',
    },
    welcomeTitle: {
        fontSize: TYPOGRAPHY.fontSize.xl,
        fontWeight: TYPOGRAPHY.fontWeight.bold,
        color: COLORS.textInverse,
        marginBottom: SPACING.sm,
    },
    welcomeText: {
        fontSize: TYPOGRAPHY.fontSize.sm,
        color: COLORS.primaryLight,
        lineHeight: TYPOGRAPHY.lineHeight.relaxed * TYPOGRAPHY.fontSize.sm,
    },
    cardsContainer: {
        flex: 1,
    },
    primaryCard: {
        backgroundColor: COLORS.surface,
        borderRadius: RADIUS.lg,
        padding: SPACING.lg,
        marginBottom: SPACING.md,
        ...SHADOWS.lg,
    },
    cardIcon: {
        width: 60,
        height: 60,
        borderRadius: RADIUS.md,
        backgroundColor: COLORS.primary + '15',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: SPACING.md,
    },
    cardEmoji: {
        fontSize: 32,
    },
    primaryCardTitle: {
        fontSize: TYPOGRAPHY.fontSize.xl,
        fontWeight: TYPOGRAPHY.fontWeight.bold,
        color: COLORS.textPrimary,
        marginBottom: SPACING.xs,
    },
    primaryCardDescription: {
        fontSize: TYPOGRAPHY.fontSize.sm,
        color: COLORS.textSecondary,
        lineHeight: TYPOGRAPHY.lineHeight.normal * TYPOGRAPHY.fontSize.sm,
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: SPACING.md,
    },
    secondaryCard: {
        backgroundColor: COLORS.surface,
        borderRadius: RADIUS.md,
        padding: SPACING.md,
        flex: 1,
        marginHorizontal: SPACING.xs,
        ...SHADOWS.md,
    },
    smallCardIcon: {
        width: 50,
        height: 50,
        borderRadius: RADIUS.sm,
        backgroundColor: COLORS.secondary + '15',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: SPACING.sm,
    },
    smallCardEmoji: {
        fontSize: 24,
    },
    secondaryCardTitle: {
        fontSize: TYPOGRAPHY.fontSize.sm,
        fontWeight: TYPOGRAPHY.fontWeight.semibold,
        color: COLORS.textPrimary,
    },
    settingsButton: {
        backgroundColor: 'rgba(255, 255, 255, 0.15)',
        borderRadius: RADIUS.md,
        padding: SPACING.md,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.2)',
        alignItems: 'center',
    },
    settingsButtonText: {
        fontSize: TYPOGRAPHY.fontSize.base,
        fontWeight: TYPOGRAPHY.fontWeight.semibold,
        color: COLORS.textInverse,
    },
    footer: {
        paddingVertical: SPACING.lg,
        alignItems: 'center',
    },
    footerText: {
        fontSize: TYPOGRAPHY.fontSize.xs,
        color: COLORS.primaryLight,
        fontWeight: TYPOGRAPHY.fontWeight.medium,
    },
});
