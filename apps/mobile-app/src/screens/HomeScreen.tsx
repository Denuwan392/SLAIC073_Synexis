import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, StatusBar, SafeAreaView, ScrollView } from 'react-native';
import { COLORS, TYPOGRAPHY, SPACING, RADIUS, SHADOWS, POPULAR_DEPARTURES } from '../utils/constants';

export default function HomeScreen({ navigation }: any) {
  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" />
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.appName}>Synexis Transit</Text>
            <View style={styles.statusRow}>
              <View style={styles.statusDot} />
              <Text style={styles.statusText}>Sri Lanka Railways & Bus Network</Text>
            </View>
          </View>
          <TouchableOpacity 
            style={styles.settingsBtn}
            onPress={() => navigation.navigate('Settings')}
            activeOpacity={0.7}
          >
            <Text style={styles.settingsIcon}>⚙️</Text>
          </TouchableOpacity>
        </View>

        {/* Route Search Card (Citymapper / Apple Maps Style) */}
        <TouchableOpacity 
          style={styles.plannerCard}
          onPress={() => navigation.navigate('Chat')}
          activeOpacity={0.9}
        >
          <View style={styles.locationField}>
            <View style={[styles.dot, styles.dotOrigin]} />
            <Text style={styles.locationTextOrigin}>Current Location (Colombo Fort)</Text>
          </View>
          
          <View style={styles.lineDivider} />

          <View style={styles.locationField}>
            <View style={[styles.dot, styles.dotDest]} />
            <Text style={styles.locationPlaceholder}>Where do you want to go?</Text>
          </View>

          <View style={styles.searchActionRow}>
            <Text style={styles.searchActionText}>Ask Transit AI for routes, times & schedules ➔</Text>
          </View>
        </TouchableOpacity>

        {/* Line Categories */}
        <View style={styles.linesRow}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.linesScroll}>
            <TouchableOpacity style={styles.lineChip} onPress={() => navigation.navigate('Chat')}>
              <Text style={styles.lineIcon}>🚆</Text>
              <Text style={styles.lineText}>Coastal Line</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.lineChip} onPress={() => navigation.navigate('Chat')}>
              <Text style={styles.lineIcon}>🚆</Text>
              <Text style={styles.lineText}>Main Line</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.lineChip} onPress={() => navigation.navigate('Chat')}>
              <Text style={styles.lineIcon}>🚌</Text>
              <Text style={styles.lineText}>Expressway AC</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.lineChip} onPress={() => navigation.navigate('Chat')}>
              <Text style={styles.lineIcon}>🚌</Text>
              <Text style={styles.lineText}>SLTB Intercity</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>

        {/* Next Departures Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Featured Departures</Text>

          {POPULAR_DEPARTURES.map((item) => {
            const isTrain = item.type === 'train';
            return (
              <TouchableOpacity
                key={item.id}
                style={styles.departureCard}
                onPress={() => navigation.navigate('Chat')}
                activeOpacity={0.8}
              >
                <View style={styles.cardHeader}>
                  <View style={[
                    styles.badge, 
                    isTrain ? styles.trainBadge : styles.busBadge
                  ]}>
                    <Text style={[
                      styles.badgeText,
                      isTrain ? styles.trainBadgeText : styles.busBadgeText
                    ]}>
                      {isTrain ? '🚆 TRAIN' : '🚌 BUS'} • {item.line}
                    </Text>
                  </View>
                  <Text style={styles.departureTime}>{item.departs}</Text>
                </View>

                <Text style={styles.routeTitle}>{item.route}</Text>
                
                <View style={styles.cardFooter}>
                  <Text style={styles.vehicleName}>{item.vehicle}</Text>
                  <Text style={styles.duration}>Est. {item.duration}</Text>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Synexis Mobile • Sri Lanka Public Transport API</Text>
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
    letterSpacing: -0.5,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#10B981',
    marginRight: 6,
  },
  statusText: {
    fontSize: TYPOGRAPHY.fontSize.xs,
    color: COLORS.textSecondary,
  },
  settingsBtn: {
    width: 38,
    height: 38,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.surface,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  settingsIcon: {
    fontSize: 16,
  },
  plannerCard: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    marginVertical: SPACING.sm,
    borderWidth: 1,
    borderColor: COLORS.border,
    ...SHADOWS.md,
  },
  locationField: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: SPACING.md,
  },
  dotOrigin: {
    backgroundColor: '#10B981',
  },
  dotDest: {
    backgroundColor: COLORS.primary,
  },
  locationTextOrigin: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    color: COLORS.textSecondary,
    fontWeight: TYPOGRAPHY.fontWeight.medium,
  },
  locationPlaceholder: {
    fontSize: TYPOGRAPHY.fontSize.base,
    color: COLORS.textPrimary,
    fontWeight: TYPOGRAPHY.fontWeight.semibold,
  },
  lineDivider: {
    height: 1,
    backgroundColor: COLORS.borderLight,
    marginVertical: SPACING.xs,
    marginLeft: 24,
  },
  searchActionRow: {
    marginTop: SPACING.md,
    paddingTop: SPACING.sm,
    borderTopWidth: 1,
    borderTopColor: COLORS.borderLight,
    alignItems: 'flex-end',
  },
  searchActionText: {
    fontSize: TYPOGRAPHY.fontSize.xs,
    color: COLORS.primary,
    fontWeight: TYPOGRAPHY.fontWeight.bold,
  },
  linesRow: {
    marginVertical: SPACING.md,
  },
  linesScroll: {
    gap: SPACING.xs,
  },
  lineChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: RADIUS.full,
    borderWidth: 1,
    borderColor: COLORS.border,
    ...SHADOWS.sm,
  },
  lineIcon: {
    fontSize: 14,
    marginRight: 6,
  },
  lineText: {
    fontSize: TYPOGRAPHY.fontSize.xs,
    fontWeight: TYPOGRAPHY.fontWeight.semibold,
    color: COLORS.textPrimary,
  },
  section: {
    marginBottom: SPACING.lg,
  },
  sectionTitle: {
    fontSize: TYPOGRAPHY.fontSize.xs,
    fontWeight: TYPOGRAPHY.fontWeight.bold,
    color: COLORS.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: SPACING.sm,
    marginLeft: 2,
  },
  departureCard: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    marginBottom: SPACING.sm,
    borderWidth: 1,
    borderColor: COLORS.border,
    ...SHADOWS.sm,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.xs,
  },
  badge: {
    paddingHorizontal: SPACING.sm,
    paddingVertical: 3,
    borderRadius: RADIUS.sm,
  },
  trainBadge: {
    backgroundColor: COLORS.trainBadgeBg,
  },
  busBadge: {
    backgroundColor: COLORS.busBadgeBg,
  },
  badgeText: {
    fontSize: TYPOGRAPHY.fontSize.xs,
    fontWeight: TYPOGRAPHY.fontWeight.bold,
  },
  trainBadgeText: {
    color: COLORS.trainBadgeText,
  },
  busBadgeText: {
    color: COLORS.busBadgeText,
  },
  departureTime: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    fontWeight: TYPOGRAPHY.fontWeight.bold,
    color: COLORS.textPrimary,
  },
  routeTitle: {
    fontSize: TYPOGRAPHY.fontSize.base,
    fontWeight: TYPOGRAPHY.fontWeight.bold,
    color: COLORS.textPrimary,
    marginVertical: 4,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 4,
  },
  vehicleName: {
    fontSize: TYPOGRAPHY.fontSize.xs,
    color: COLORS.textSecondary,
  },
  duration: {
    fontSize: TYPOGRAPHY.fontSize.xs,
    color: COLORS.textTertiary,
    fontWeight: TYPOGRAPHY.fontWeight.medium,
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
