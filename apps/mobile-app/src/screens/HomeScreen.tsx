import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, StatusBar, SafeAreaView, ScrollView, Modal } from 'react-native';
import { COLORS, TYPOGRAPHY, SPACING, RADIUS, SHADOWS, SIGNATURE_DEPARTURES } from '../utils/constants';

interface LineDetail {
  title: string;
  type: string;
  route: string;
  departures: string[];
  stops: string[];
  serviceClasses: string;
}

const LINE_DETAILS: Record<string, LineDetail> = {
  coastal: {
    title: 'Coastal Line Railway',
    type: 'Train Express',
    route: 'Colombo Fort ↔ Galle ↔ Matara',
    departures: ['06:30 AM (Ruhunu Kumari)', '07:00 AM (Galle Express)', '10:30 AM (Dakshina)', '04:30 PM (Sagarika)', '05:30 PM (Samudra Devi)'],
    stops: ['Colombo Fort', 'Panadura', 'Kalutara South', 'Aluthgama', 'Ambalangoda', 'Hikkaduwa', 'Galle', 'Weligama', 'Matara'],
    serviceClasses: '3rd Class Economy | 2nd Class Reserved | 1st Class AC',
  },
  mainline: {
    title: 'Main Line Railway',
    type: 'Train Express',
    route: 'Colombo Fort ↔ Kandy ↔ Badulla',
    departures: ['05:30 AM (Ella Odyssey)', '05:55 AM (Podi Menike)', '08:30 AM (Udarata Menike)', '12:40 PM (Senkadagala)', '05:45 PM (Kandy Express)'],
    stops: ['Colombo Fort', 'Ragama', 'Gampaha', 'Polgahawela', 'Rambukkana', 'Peradeniya', 'Kandy', 'Nanu Oya', 'Ella', 'Badulla'],
    serviceClasses: '3rd Class Economy | 2nd Class Reserved | Luxury Tourist',
  },
  southern: {
    title: 'Southern Expressway AC',
    type: 'Luxury Bus',
    route: 'Colombo (Makumbura) ↔ Galle ↔ Matara',
    departures: ['Departures every 20 minutes from 05:00 AM to 09:00 PM daily.'],
    stops: ['Makumbura Multimodal Center', 'Galle Central Bus Stand', 'Matara Highway Station'],
    serviceClasses: 'Point-to-Point Super Luxury AC Expressway Service',
  },
  central: {
    title: 'Central Expressway AC',
    type: 'Luxury Bus',
    route: 'Colombo (Pettah) ↔ Kandy (Goods Shed)',
    departures: ['Departures every 30 minutes from 05:00 AM to 08:30 PM daily.'],
    stops: ['Pettah Central Terminal', 'Mirigama Interchange', 'Kurunegala Interchange', 'Kandy Goods Shed'],
    serviceClasses: 'Expressway AC Luxury | SLTB Intercity Bus Service',
  },
};

export default function HomeScreen({ navigation }: any) {
  const [selectedLine, setSelectedLine] = useState<LineDetail | null>(null);

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.background} />
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        
        {/* Header */}
        <View style={styles.header}>
          <View>
            <View style={styles.brandRow}>
              <Text style={styles.brandTitle}>SYNEXIS</Text>
              <View style={styles.liveBadge}>
                <View style={styles.liveDot} />
                <Text style={styles.liveText}>NETWORK NORMAL</Text>
              </View>
            </View>
            <Text style={styles.subTitle}>Sri Lanka Public Transit Guide</Text>
          </View>

          <TouchableOpacity 
            style={styles.settingsBtn}
            onPress={() => navigation.navigate('Settings')}
            activeOpacity={0.7}
          >
            <Text style={styles.settingsIcon}>⚙️</Text>
          </TouchableOpacity>
        </View>

        {/* Route Finder Card */}
        <View style={styles.plannerCard}>
          <Text style={styles.cardHeader}>ROUTE & SCHEDULE FINDER</Text>
          
          <View style={styles.nodeWrapper}>
            <View style={styles.nodeRow}>
              <View style={[styles.nodeDot, styles.nodeOrigin]} />
              <View style={styles.nodeTextWrapper}>
                <Text style={styles.nodeLabel}>ORIGIN</Text>
                <Text style={styles.nodeValue}>Colombo Fort</Text>
              </View>
            </View>

            <View style={styles.trackLine} />

            <View style={styles.nodeRow}>
              <View style={[styles.nodeDot, styles.nodeDest]} />
              <View style={styles.nodeTextWrapper}>
                <Text style={styles.nodeLabel}>DESTINATION</Text>
                <Text style={styles.nodeValuePlaceholder}>Select station or route...</Text>
              </View>
            </View>

            <TouchableOpacity 
              style={styles.actionBtn}
              onPress={() => navigation.navigate('Chat')}
              activeOpacity={0.8}
            >
              <Text style={styles.actionBtnText}>🔍 Search Timetables with AI ➔</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Real Line Explorer (Opens Schedule Modal) */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>TRANSIT LINES & TIMETABLES</Text>
          
          <View style={styles.linesGrid}>
            <TouchableOpacity style={styles.lineCard} onPress={() => setSelectedLine(LINE_DETAILS.coastal)}>
              <Text style={styles.lineCardIcon}>🚆</Text>
              <Text style={styles.lineCardTitle}>Coastal Rail</Text>
              <Text style={styles.lineCardSub}>Colombo ➔ Galle</Text>
              <Text style={styles.viewScheduleText}>View Schedule ➔</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.lineCard} onPress={() => setSelectedLine(LINE_DETAILS.mainline)}>
              <Text style={styles.lineCardIcon}>🚆</Text>
              <Text style={styles.lineCardTitle}>Main Line Rail</Text>
              <Text style={styles.lineCardSub}>Colombo ➔ Kandy</Text>
              <Text style={styles.viewScheduleText}>View Schedule ➔</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.lineCard} onPress={() => setSelectedLine(LINE_DETAILS.southern)}>
              <Text style={styles.lineCardIcon}>🚌</Text>
              <Text style={styles.lineCardTitle}>Southern Highway</Text>
              <Text style={styles.lineCardSub}>Matara Luxury AC</Text>
              <Text style={styles.viewScheduleText}>View Schedule ➔</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.lineCard} onPress={() => setSelectedLine(LINE_DETAILS.central)}>
              <Text style={styles.lineCardIcon}>🚌</Text>
              <Text style={styles.lineCardTitle}>Central Highway</Text>
              <Text style={styles.lineCardSub}>Kandy Express</Text>
              <Text style={styles.viewScheduleText}>View Schedule ➔</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Transit Network Hubs Guide */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>MAJOR TRANSIT HUBS</Text>
          <View style={styles.fareCard}>
            <View style={styles.fareRow}>
              <Text style={styles.fareType}>🚆 Main Railway Hubs</Text>
              <Text style={styles.fareAmount}>Central Terminal</Text>
            </View>
            <Text style={styles.fareDetail}>Colombo Fort, Maradana, Kandy, Galle, Jaffna, Anuradhapura</Text>

            <View style={styles.fareDivider} />

            <View style={styles.fareRow}>
              <Text style={styles.fareType}>🚌 Main Expressway Hubs</Text>
              <Text style={styles.fareAmount}>Highway Multimodal</Text>
            </View>
            <Text style={styles.fareDetail}>Makumbura MMC, Pettah Central Stand, Kandy Goods Shed</Text>
          </View>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Synexis Mobile Edition • Sri Lanka Public Transit</Text>
        </View>

      </ScrollView>



      {/* Schedule Detail Modal */}
      <Modal
        visible={!!selectedLine}
        transparent
        animationType="fade"
        onRequestClose={() => setSelectedLine(null)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            {selectedLine && (
              <>
                <View style={styles.modalHeader}>
                  <Text style={styles.modalTitle}>{selectedLine.title}</Text>
                  <TouchableOpacity onPress={() => setSelectedLine(null)}>
                    <Text style={styles.closeBtn}>✕</Text>
                  </TouchableOpacity>
                </View>

                <Text style={styles.modalSub}>{selectedLine.route}</Text>

                <View style={styles.modalSection}>
                  <Text style={styles.modalSectionTitle}>DAILY DEPARTURES</Text>
                  {selectedLine.departures.map((dep, idx) => (
                    <Text key={idx} style={styles.modalItem}>• {dep}</Text>
                  ))}
                </View>

                <View style={styles.modalSection}>
                  <Text style={styles.modalSectionTitle}>STOPS</Text>
                  <Text style={styles.modalItem}>{selectedLine.stops.join(' ➔ ')}</Text>
                </View>

                <View style={styles.modalSection}>
                  <Text style={styles.modalSectionTitle}>SERVICE CLASSES</Text>
                  <Text style={styles.modalItem}>{selectedLine.serviceClasses}</Text>
                </View>

                <TouchableOpacity 
                  style={styles.modalAiBtn}
                  onPress={() => {
                    const query = `Show details for ${selectedLine.title}`;
                    setSelectedLine(null);
                    navigation.navigate('Chat');
                  }}
                >
                  <Text style={styles.modalAiBtnText}>Ask AI Assistant For Live Details ➔</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>
      </Modal>

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
  plannerCard: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    padding: SPACING.lg,
    marginVertical: SPACING.sm,
    borderWidth: 1,
    borderColor: COLORS.border,
    ...SHADOWS.md,
  },
  cardHeader: {
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
    fontSize: TYPOGRAPHY.fontSize.sm,
    fontWeight: TYPOGRAPHY.fontWeight.semibold,
    color: COLORS.textSecondary,
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
  linesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
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
    marginBottom: 8,
  },
  viewScheduleText: {
    fontSize: 11,
    fontWeight: TYPOGRAPHY.fontWeight.bold,
    color: COLORS.cyan,
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
  fareCard: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  fareRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 2,
  },
  fareType: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    fontWeight: TYPOGRAPHY.fontWeight.bold,
    color: COLORS.textPrimary,
  },
  fareAmount: {
    fontSize: TYPOGRAPHY.fontSize.xs,
    fontWeight: TYPOGRAPHY.fontWeight.bold,
    color: COLORS.cyan,
  },
  fareDetail: {
    fontSize: TYPOGRAPHY.fontSize.xs,
    color: COLORS.textSecondary,
  },
  fareDivider: {
    height: 1,
    backgroundColor: COLORS.border,
    marginVertical: SPACING.sm,
  },
  footer: {
    alignItems: 'center',
    paddingVertical: SPACING.xl,
  },
  footerText: {
    fontSize: TYPOGRAPHY.fontSize.xs,
    color: COLORS.textTertiary,
  },
  fabBtn: {
    position: 'absolute',
    bottom: SPACING.lg,
    right: SPACING.lg,
    backgroundColor: COLORS.cyan,
    paddingHorizontal: SPACING.md + 4,
    paddingVertical: SPACING.sm + 2,
    borderRadius: RADIUS.full,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    ...SHADOWS.md,
  },
  fabText: {
    color: COLORS.textInverse,
    fontSize: TYPOGRAPHY.fontSize.sm,
    fontWeight: TYPOGRAPHY.fontWeight.bold,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: SPACING.md,
  },
  modalContent: {
    width: '100%',
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    padding: SPACING.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
    ...SHADOWS.md,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: TYPOGRAPHY.fontSize.lg,
    fontWeight: TYPOGRAPHY.fontWeight.bold,
    color: COLORS.textPrimary,
  },
  closeBtn: {
    fontSize: 20,
    color: COLORS.textTertiary,
    fontWeight: 'bold',
    padding: 4,
  },
  modalSub: {
    fontSize: TYPOGRAPHY.fontSize.xs,
    color: COLORS.cyan,
    fontWeight: TYPOGRAPHY.fontWeight.bold,
    marginBottom: SPACING.md,
    marginTop: 2,
  },
  modalSection: {
    marginBottom: SPACING.md,
  },
  modalSectionTitle: {
    fontSize: 10,
    fontWeight: TYPOGRAPHY.fontWeight.bold,
    color: COLORS.textSecondary,
    letterSpacing: 1,
    marginBottom: 4,
  },
  modalItem: {
    fontSize: TYPOGRAPHY.fontSize.xs,
    color: COLORS.textPrimary,
    lineHeight: 18,
  },
  modalAiBtn: {
    backgroundColor: COLORS.cyan,
    borderRadius: RADIUS.md,
    paddingVertical: SPACING.sm + 2,
    alignItems: 'center',
    marginTop: SPACING.sm,
  },
  modalAiBtnText: {
    color: COLORS.textInverse,
    fontSize: TYPOGRAPHY.fontSize.xs,
    fontWeight: TYPOGRAPHY.fontWeight.bold,
  },
});
