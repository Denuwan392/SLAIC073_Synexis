import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, StatusBar, SafeAreaView, ScrollView, Modal } from 'react-native';
import { COLORS, TYPOGRAPHY, SPACING, RADIUS, SHADOWS } from '../utils/constants';

interface TransportCategoryDetail {
  title: string;
  subtitle: string;
  emoji: string;
  routes: Array<{
    name: string;
    departs: string;
    stops: string;
    type: string;
  }>;
}

const BUS_DETAILS: TransportCategoryDetail = {
  title: 'Sri Lanka Bus Services',
  subtitle: 'Expressway AC, Intercity & SLTB Routes',
  emoji: '🚌',
  routes: [
    {
      name: 'Colombo ↔ Kandy (Central Expressway EX-1)',
      departs: 'Every 30 minutes from 05:00 AM to 08:30 PM',
      stops: 'Pettah Central Terminal, Mirigama Interchange, Kurunegala, Kandy Goods Shed',
      type: 'Luxury AC Bus',
    },
    {
      name: 'Colombo ↔ Galle / Matara (Southern Expressway)',
      departs: 'Every 20 minutes from 05:00 AM to 09:00 PM',
      stops: 'Makumbura Multimodal Center (Kottawa), Galle Central Bus Stand, Matara Highway Station',
      type: 'Super Luxury Highway Bus',
    },
    {
      name: 'Colombo ↔ Jaffna (Northern Night Intercity)',
      departs: '08:00 PM, 08:30 PM & 09:00 PM daily',
      stops: 'Pettah Terminal, Kurunegala, Anuradhapura, Vavuniya, Jaffna Stand',
      type: 'Intercity AC Sleeper',
    },
  ],
};

const TRAIN_DETAILS: TransportCategoryDetail = {
  title: 'Sri Lanka Railway Services',
  subtitle: 'Express Intercity & Regional Trains',
  emoji: '🚆',
  routes: [
    {
      name: 'Ruhunu Kumari (Train 8058 - Coastal Line)',
      departs: '06:30 AM (Colombo Fort ➔ Matara)',
      stops: 'Panadura, Kalutara South, Aluthgama, Ambalangoda, Hikkaduwa, Galle, Weligama, Matara',
      type: 'Express Intercity Train',
    },
    {
      name: 'Galle Express (Train 8050 - Coastal Line)',
      departs: '07:00 AM (Colombo Fort ➔ Galle)',
      stops: 'Kalutara South, Aluthgama, Hikkaduwa, Galle',
      type: 'Express Commuter Train',
    },
    {
      name: 'Ella Odyssey & Podi Menike (Main Line)',
      departs: '05:30 AM & 05:55 AM (Colombo Fort ➔ Badulla)',
      stops: 'Ragama, Gampaha, Polgahawela, Peradeniya, Kandy, Nanu Oya, Ella, Badulla',
      type: 'Luxury Tourist / Express Train',
    },
    {
      name: 'Udarata Menike (Train 1015 - Main Line)',
      departs: '08:30 AM (Colombo Fort ➔ Badulla)',
      stops: 'Ragama, Polgahawela, Kandy, Hatton, Nanu Oya, Ella, Badulla',
      type: 'Express Intercity Train',
    },
  ],
};

export default function HomeScreen({ navigation }: any) {
  const [selectedCategory, setSelectedCategory] = useState<TransportCategoryDetail | null>(null);

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

        {/* 2 Main Transit Categories (Buses & Trains) */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>TRANSIT CATEGORIES</Text>
          
          <View style={styles.categoryStack}>
            {/* Bus Category Card */}
            <TouchableOpacity 
              style={styles.modeCard} 
              onPress={() => setSelectedCategory(BUS_DETAILS)}
              activeOpacity={0.8}
            >
              <View style={styles.modeIconWrapper}>
                <Text style={styles.modeEmoji}>🚌</Text>
              </View>
              <View style={styles.modeInfo}>
                <Text style={styles.modeTitle}>Bus Services</Text>
                <Text style={styles.modeSub}>Expressway AC, Intercity & SLTB Routes</Text>
                <Text style={styles.modeAction}>View Bus Details ➔</Text>
              </View>
            </TouchableOpacity>

            {/* Train Category Card */}
            <TouchableOpacity 
              style={styles.modeCard} 
              onPress={() => setSelectedCategory(TRAIN_DETAILS)}
              activeOpacity={0.8}
            >
              <View style={styles.modeIconWrapper}>
                <Text style={styles.modeEmoji}>🚆</Text>
              </View>
              <View style={styles.modeInfo}>
                <Text style={styles.modeTitle}>Train Services</Text>
                <Text style={styles.modeSub}>Sri Lanka Railways Express Timetables</Text>
                <Text style={styles.modeAction}>View Train Details ➔</Text>
              </View>
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

      {/* Main Details Modal */}
      <Modal
        visible={!!selectedCategory}
        transparent
        animationType="fade"
        onRequestClose={() => setSelectedCategory(null)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            {selectedCategory && (
              <ScrollView showsVerticalScrollIndicator={false}>
                <View style={styles.modalHeader}>
                  <View style={styles.modalTitleRow}>
                    <Text style={styles.modalEmoji}>{selectedCategory.emoji}</Text>
                    <Text style={styles.modalTitle}>{selectedCategory.title}</Text>
                  </View>
                  <TouchableOpacity onPress={() => setSelectedCategory(null)}>
                    <Text style={styles.closeBtn}>✕</Text>
                  </TouchableOpacity>
                </View>

                <Text style={styles.modalSub}>{selectedCategory.subtitle}</Text>

                {selectedCategory.routes.map((routeItem, index) => (
                  <View key={index} style={styles.routeCardItem}>
                    <Text style={styles.routeName}>{routeItem.name}</Text>
                    <Text style={styles.routeType}>{routeItem.type}</Text>
                    
                    <Text style={styles.routeLabel}>DEPARTURES:</Text>
                    <Text style={styles.routeValue}>{routeItem.departs}</Text>
                    
                    <Text style={styles.routeLabel}>MAJOR STOPS:</Text>
                    <Text style={styles.routeValue}>{routeItem.stops}</Text>
                  </View>
                ))}

                <TouchableOpacity 
                  style={styles.modalAiBtn}
                  onPress={() => {
                    setSelectedCategory(null);
                    navigation.navigate('Chat');
                  }}
                >
                  <Text style={styles.modalAiBtnText}>Search Details with AI Assistant ➔</Text>
                </TouchableOpacity>
              </ScrollView>
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
  sectionTitle: {
    fontSize: 11,
    fontWeight: TYPOGRAPHY.fontWeight.bold,
    color: COLORS.textSecondary,
    letterSpacing: 1,
    marginBottom: SPACING.sm,
    marginLeft: 2,
  },
  categoryStack: {
    gap: SPACING.sm,
  },
  modeCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    ...SHADOWS.sm,
  },
  modeIconWrapper: {
    width: 48,
    height: 48,
    borderRadius: RADIUS.md,
    backgroundColor: COLORS.surfaceSubtle,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  modeEmoji: {
    fontSize: 24,
  },
  modeInfo: {
    flex: 1,
  },
  modeTitle: {
    fontSize: TYPOGRAPHY.fontSize.base,
    fontWeight: TYPOGRAPHY.fontWeight.bold,
    color: COLORS.textPrimary,
  },
  modeSub: {
    fontSize: TYPOGRAPHY.fontSize.xs,
    color: COLORS.textSecondary,
    marginTop: 2,
    marginBottom: 6,
  },
  modeAction: {
    fontSize: 11,
    fontWeight: TYPOGRAPHY.fontWeight.bold,
    color: COLORS.cyan,
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
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xl,
  },
  modalContent: {
    width: '100%',
    maxHeight: '85%',
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
  modalTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  modalEmoji: {
    fontSize: 22,
    marginRight: 8,
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
  routeCardItem: {
    backgroundColor: COLORS.surfaceSubtle,
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    marginBottom: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  routeName: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    fontWeight: TYPOGRAPHY.fontWeight.bold,
    color: COLORS.textPrimary,
  },
  routeType: {
    fontSize: 11,
    fontWeight: TYPOGRAPHY.fontWeight.bold,
    color: COLORS.cyan,
    marginBottom: SPACING.sm,
    marginTop: 2,
  },
  routeLabel: {
    fontSize: 10,
    fontWeight: TYPOGRAPHY.fontWeight.bold,
    color: COLORS.textTertiary,
    letterSpacing: 0.8,
    marginTop: 4,
  },
  routeValue: {
    fontSize: TYPOGRAPHY.fontSize.xs,
    color: COLORS.textPrimary,
    marginTop: 2,
    lineHeight: 18,
  },
  modalAiBtn: {
    backgroundColor: COLORS.cyan,
    borderRadius: RADIUS.md,
    paddingVertical: SPACING.sm + 2,
    alignItems: 'center',
    marginTop: SPACING.xs,
    marginBottom: SPACING.sm,
  },
  modalAiBtnText: {
    color: COLORS.textInverse,
    fontSize: TYPOGRAPHY.fontSize.xs,
    fontWeight: TYPOGRAPHY.fontWeight.bold,
  },
});
