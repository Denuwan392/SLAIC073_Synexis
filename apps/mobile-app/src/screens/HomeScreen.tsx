import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, StatusBar, SafeAreaView, ScrollView } from 'react-native';
import { COLORS, TYPOGRAPHY, SPACING, RADIUS, SHADOWS, SIGNATURE_DEPARTURES } from '../utils/constants';

export default function HomeScreen({ navigation }: any) {
  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.background} />
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        
        {/* Signature Brand Header */}
        <View style={styles.header}>
          <View>
            <View style={styles.brandRow}>
              <Text style={styles.brandTitle}>SYNEXIS</Text>
              <View style={styles.liveBadge}>
                <View style={styles.liveDot} />
                <Text style={styles.liveText}>LIVE TRANSIT</Text>
              </View>
            </View>
            <Text style={styles.subTitle}>Sri Lanka Public Transport Network</Text>
          </View>

          <TouchableOpacity 
            style={styles.settingsBtn}
            onPress={() => navigation.navigate('Settings')}
            activeOpacity={0.7}
          >
            <Text style={styles.settingsIcon}>⚙️</Text>
          </TouchableOpacity>
        </View>

        {/* Bespoke Route Node Finder */}
        <View style={styles.routeCard}>
          <Text style={styles.routeCardHeader}>FIND ROUTE & SCHEDULES</Text>
          
          <TouchableOpacity 
            style={styles.nodeWrapper}
            onPress={() => navigation.navigate('Chat')}
            activeOpacity={0.9}
          >
            <View style={styles.nodeRow}>
              <View style={[styles.nodeDot, styles.nodeOrigin]} />
              <View style={styles.nodeTextWrapper}>
                <Text style={styles.nodeLabel}>ORIGIN</Text>
                <Text style={styles.nodeValue}>Colombo Fort Station</Text>
              </View>
            </View>

            <View style={styles.trackLine} />

            <View style={styles.nodeRow}>
              <View style={[styles.nodeDot, styles.nodeDest]} />
              <View style={styles.nodeTextWrapper}>
                <Text style={styles.nodeLabel}>DESTINATION</Text>
                <Text style={styles.nodeValuePlaceholder}>Where do you want to go?</Text>
              </View>
            </View>

            <TouchableOpacity 
              style={styles.actionBtn}
              onPress={() => navigation.navigate('Chat')}
              activeOpacity={0.8}
            >
              <Text style={styles.actionBtnText}>Search Schedules & Ask AI ➔</Text>
            </TouchableOpacity>
          </TouchableOpacity>
        </View>

        {/* Transit Line Grid */}
        <View style={styles.linesGrid}>
          <TouchableOpacity style={styles.lineCard} onPress={() => navigation.navigate('Chat')}>
            <Text style={styles.lineCardIcon}>🚆</Text>
            <Text style={styles.lineCardTitle}>Coastal Rail</Text>
            <Text style={styles.lineCardSub}>Colombo ➔ Galle</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.lineCard} onPress={() => navigation.navigate('Chat')}>
            <Text style={styles.lineCardIcon}>🚆</Text>
            <Text style={styles.lineCardTitle}>Main Line Rail</Text>
            <Text style={styles.lineCardSub}>Colombo ➔ Kandy</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.lineCard} onPress={() => navigation.navigate('Chat')}>
            <Text style={styles.lineCardIcon}>🚌</Text>
            <Text style={styles.lineCardTitle}>Southern Highway</Text>
            <Text style={styles.lineCardSub}>Matara Luxury AC</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.lineCard} onPress={() => navigation.navigate('Chat')}>
            <Text style={styles.lineCardIcon}>🚌</Text>
            <Text style={styles.lineCardTitle}>Central Highway</Text>
            <Text style={styles.lineCardSub}>Kandy Express</Text>
          </TouchableOpacity>
        </View>

        {/* Digital Station Departure Board */}
        <View style={styles.section}>
          <View style={styles.sectionHeaderRow}>
            <Text style={styles.sectionTitle}>TERMINAL DEPARTURE BOARD</Text>
            <Text style={styles.liveClock}>REAL-TIME</Text>
          </View>

          {SIGNATURE_DEPARTURES.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={styles.departureRow}
              onPress={() => navigation.navigate('Chat')}
              activeOpacity={0.8}
            >
              <View style={styles.timeBox}>
                <Text style={styles.depTime}>{item.departs}</Text>
                <Text style={styles.depStatus}>{item.status}</Text>
              </View>

              <View style={styles.routeBox}>
                <Text style={styles.depRoute}>{item.route}</Text>
                <Text style={styles.depVehicle}>{item.vehicle}</Text>
              </View>

              <View style={[styles.lineBadge, { backgroundColor: item.badgeBg }]}>
                <Text style={[styles.lineBadgeText, { color: item.badgeColor }]}>
                  {item.line}
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Synexis Obsidian Edition • Sri Lanka Transit Engine</Text>
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
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  brandTitle: {
    fontSize: TYPOGRAPHY.fontSize['2xl'],
    fontWeight: TYPOGRAPHY.fontWeight.bold,
    color: COLORS.textPrimary,
    letterSpacing: 2,
  },
  liveBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(16, 185, 129, 0.15)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: RADIUS.full,
    marginLeft: SPACING.sm,
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.3)',
  },
  liveDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: COLORS.emerald,
    marginRight: 4,
  },
  liveText: {
    fontSize: 10,
    fontWeight: TYPOGRAPHY.fontWeight.bold,
    color: COLORS.emerald,
    letterSpacing: 0.5,
  },
  subTitle: {
    fontSize: TYPOGRAPHY.fontSize.xs,
    color: COLORS.textSecondary,
    marginTop: 2,
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
  routeCard: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    padding: SPACING.lg,
    marginVertical: SPACING.sm,
    borderWidth: 1,
    borderColor: COLORS.border,
    ...SHADOWS.md,
  },
  routeCardHeader: {
    fontSize: 11,
    fontWeight: TYPOGRAPHY.fontWeight.bold,
    color: COLORS.cyan,
    letterSpacing: 1.5,
    marginBottom: SPACING.md,
  },
  nodeWrapper: {
    backgroundColor: COLORS.surfaceSubtle,
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  nodeRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  nodeDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: SPACING.md,
  },
  nodeOrigin: {
    backgroundColor: COLORS.emerald,
  },
  nodeDest: {
    backgroundColor: COLORS.cyan,
  },
  nodeTextWrapper: {
    flex: 1,
  },
  nodeLabel: {
    fontSize: 10,
    fontWeight: TYPOGRAPHY.fontWeight.bold,
    color: COLORS.textTertiary,
    letterSpacing: 1,
  },
  nodeValue: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    fontWeight: TYPOGRAPHY.fontWeight.semibold,
    color: COLORS.textPrimary,
  },
  nodeValuePlaceholder: {
    fontSize: TYPOGRAPHY.fontSize.base,
    fontWeight: TYPOGRAPHY.fontWeight.semibold,
    color: COLORS.cyan,
  },
  trackLine: {
    height: 16,
    width: 2,
    backgroundColor: COLORS.border,
    marginLeft: 4,
    marginVertical: 4,
  },
  actionBtn: {
    backgroundColor: COLORS.cyan,
    borderRadius: RADIUS.md,
    paddingVertical: SPACING.md - 2,
    alignItems: 'center',
    marginTop: SPACING.lg,
  },
  actionBtnText: {
    color: COLORS.textInverse,
    fontSize: TYPOGRAPHY.fontSize.sm,
    fontWeight: TYPOGRAPHY.fontWeight.bold,
    letterSpacing: 0.5,
  },
  linesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginVertical: SPACING.md,
    gap: SPACING.xs,
  },
  lineCard: {
    width: '48.5%',
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    marginBottom: SPACING.xs,
    borderWidth: 1,
    borderColor: COLORS.border,
    ...SHADOWS.sm,
  },
  lineCardIcon: {
    fontSize: 22,
    marginBottom: 6,
  },
  lineCardTitle: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    fontWeight: TYPOGRAPHY.fontWeight.bold,
    color: COLORS.textPrimary,
  },
  lineCardSub: {
    fontSize: TYPOGRAPHY.fontSize.xs,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  section: {
    marginVertical: SPACING.md,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.sm,
    paddingHorizontal: 2,
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: TYPOGRAPHY.fontWeight.bold,
    color: COLORS.textSecondary,
    letterSpacing: 1,
  },
  liveClock: {
    fontSize: 10,
    fontWeight: TYPOGRAPHY.fontWeight.bold,
    color: COLORS.emerald,
    letterSpacing: 1,
  },
  departureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    marginBottom: SPACING.xs,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  timeBox: {
    width: 75,
  },
  depTime: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    fontWeight: TYPOGRAPHY.fontWeight.bold,
    color: COLORS.textPrimary,
  },
  depStatus: {
    fontSize: 10,
    fontWeight: TYPOGRAPHY.fontWeight.bold,
    color: COLORS.emerald,
    marginTop: 2,
  },
  routeBox: {
    flex: 1,
    paddingHorizontal: SPACING.sm,
  },
  depRoute: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    fontWeight: TYPOGRAPHY.fontWeight.bold,
    color: COLORS.textPrimary,
  },
  depVehicle: {
    fontSize: TYPOGRAPHY.fontSize.xs,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  lineBadge: {
    paddingHorizontal: SPACING.sm,
    paddingVertical: 4,
    borderRadius: RADIUS.sm,
  },
  lineBadgeText: {
    fontSize: 11,
    fontWeight: TYPOGRAPHY.fontWeight.bold,
  },
  footer: {
    alignItems: 'center',
    paddingVertical: SPACING.xl,
  },
  footerText: {
    fontSize: TYPOGRAPHY.fontSize.xs,
    color: COLORS.textTertiary,
  },
});
