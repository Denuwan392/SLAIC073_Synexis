import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, TYPOGRAPHY, SPACING } from '../utils/constants';

const Header = () => {
    return (
        <LinearGradient
            colors={[COLORS.primary, COLORS.primaryDark]}
            style={styles.container}
        >
            <Text style={styles.title}>🚌 Synexis</Text>
            <Text style={styles.subtitle}>Smart Transit Companion</Text>
        </LinearGradient>
    );
};

const styles = StyleSheet.create({
    container: {
        paddingTop: SPACING.xl + 20,
        paddingBottom: SPACING.lg,
        paddingHorizontal: SPACING.lg,
        alignItems: 'center',
    },
    title: {
        fontSize: TYPOGRAPHY.fontSize['3xl'],
        color: COLORS.textInverse,
        fontWeight: TYPOGRAPHY.fontWeight.bold,
        marginBottom: SPACING.xs / 2,
    },
    subtitle: {
        fontSize: TYPOGRAPHY.fontSize.sm,
        color: COLORS.primaryLight,
        fontWeight: TYPOGRAPHY.fontWeight.medium,
    },
});

export default Header;
