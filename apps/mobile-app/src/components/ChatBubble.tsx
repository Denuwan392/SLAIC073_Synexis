import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Message } from '../types';
import { COLORS, TYPOGRAPHY, SPACING, RADIUS, SHADOWS } from '../utils/constants';

interface ChatBubbleProps {
  message: Message;
}

export default function ChatBubble({ message }: ChatBubbleProps) {
  const isUser = message.sender.name === 'User';
  
  const formattedTime = new Date(message.timestamp).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <View style={[styles.container, isUser ? styles.userContainer : styles.botContainer]}>
      {isUser ? (
        <LinearGradient
          colors={[COLORS.primary, COLORS.primaryDark]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[styles.bubble, styles.userBubble]}
        >
          <Text style={[styles.messageText, styles.userText]}>
            {message.content}
          </Text>
          <Text style={[styles.timestamp, styles.userTimestamp]}>
            {formattedTime}
          </Text>
        </LinearGradient>
      ) : (
        <View style={[styles.bubble, styles.botBubble]}>
          <View style={styles.botHeader}>
            <View style={styles.botAvatar}>
              <Text style={styles.botIcon}>🤖</Text>
            </View>
            <View style={styles.botMeta}>
              <Text style={styles.botName}>Synexis Assistant</Text>
              <Text style={styles.botBadge}>AI Verified</Text>
            </View>
          </View>
          <Text style={[styles.messageText, styles.botText]}>
            {message.content}
          </Text>
          <Text style={[styles.timestamp, styles.botTimestamp]}>
            {formattedTime}
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: SPACING.xs,
    paddingHorizontal: SPACING.md,
  },
  userContainer: {
    alignItems: 'flex-end',
  },
  botContainer: {
    alignItems: 'flex-start',
  },
  bubble: {
    maxWidth: '84%',
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
  },
  userBubble: {
    borderBottomRightRadius: SPACING.xs,
    ...SHADOWS.sm,
  },
  botBubble: {
    backgroundColor: COLORS.surface,
    borderBottomLeftRadius: SPACING.xs,
    ...SHADOWS.md,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  botHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.xs,
    paddingBottom: SPACING.xs,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderLight,
  },
  botAvatar: {
    width: 32,
    height: 32,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.primaryGlow,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.xs,
  },
  botIcon: {
    fontSize: 16,
  },
  botMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    flex: 1,
  },
  botName: {
    fontSize: TYPOGRAPHY.fontSize.xs,
    fontWeight: TYPOGRAPHY.fontWeight.semibold,
    color: COLORS.primary,
  },
  botBadge: {
    fontSize: 10,
    fontWeight: TYPOGRAPHY.fontWeight.bold,
    color: COLORS.secondary,
    backgroundColor: COLORS.secondary + '15',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: RADIUS.xs,
  },
  messageText: {
    fontSize: TYPOGRAPHY.fontSize.base,
    lineHeight: TYPOGRAPHY.lineHeight.normal * TYPOGRAPHY.fontSize.base,
  },
  userText: {
    color: COLORS.userMessageText,
    fontWeight: TYPOGRAPHY.fontWeight.regular,
  },
  botText: {
    color: COLORS.botMessageText,
    fontWeight: TYPOGRAPHY.fontWeight.regular,
  },
  timestamp: {
    fontSize: 11,
    marginTop: SPACING.xs,
    fontWeight: TYPOGRAPHY.fontWeight.medium,
  },
  userTimestamp: {
    color: 'rgba(255, 255, 255, 0.75)',
    alignSelf: 'flex-end',
  },
  botTimestamp: {
    color: COLORS.textTertiary,
    alignSelf: 'flex-end',
  },
});