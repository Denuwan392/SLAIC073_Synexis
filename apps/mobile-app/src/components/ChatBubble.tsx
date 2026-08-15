import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
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

  const renderContent = (content: string) => {
    // Strip raw markdown bold asterisks (**)
    const cleanContent = content.replace(/\*\*/g, '');
    const lines = cleanContent.split('\n');

    return lines.map((line, index) => {
      const trimmed = line.trim();
      if (!trimmed) {
        return <View key={index} style={{ height: 6 }} />;
      }

      const isTitle = trimmed.startsWith('🚆') || trimmed.startsWith('🚌');
      const isCardHeader = trimmed.startsWith('📌');
      const isBullet = trimmed.startsWith('•') || trimmed.startsWith('-');

      return (
        <Text
          key={index}
          style={[
            styles.messageText,
            isUser ? styles.userText : styles.botText,
            isTitle && styles.titleLine,
            isCardHeader && styles.cardHeaderLine,
            isBullet && styles.bulletLine,
          ]}
        >
          {trimmed}
        </Text>
      );
    });
  };

  return (
    <View style={[styles.container, isUser ? styles.userContainer : styles.botContainer]}>
      <View style={[styles.bubble, isUser ? styles.userBubble : styles.botBubble]}>
        {!isUser && (
          <View style={styles.botBadge}>
            <Text style={styles.botTitle}>SYNEXIS AI</Text>
            <View style={styles.verifiedDot} />
          </View>
        )}
        
        {renderContent(message.content)}

        <Text style={[styles.timestamp, isUser ? styles.userTimestamp : styles.botTimestamp]}>
          {formattedTime}
        </Text>
      </View>
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
    maxWidth: '88%',
    borderRadius: RADIUS.md,
    padding: SPACING.md,
  },
  userBubble: {
    backgroundColor: COLORS.userMessage,
    borderBottomRightRadius: 2,
    ...SHADOWS.sm,
  },
  botBubble: {
    backgroundColor: COLORS.surface,
    borderBottomLeftRadius: 2,
    borderWidth: 1,
    borderColor: COLORS.border,
    ...SHADOWS.sm,
  },
  botBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  botTitle: {
    fontSize: 10,
    fontWeight: TYPOGRAPHY.fontWeight.bold,
    color: COLORS.cyan,
    letterSpacing: 1,
  },
  verifiedDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: COLORS.cyan,
    marginLeft: 6,
  },
  messageText: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    lineHeight: 20,
    marginBottom: 2,
  },
  userText: {
    color: COLORS.textInverse,
    fontWeight: TYPOGRAPHY.fontWeight.medium,
  },
  botText: {
    color: COLORS.textPrimary,
  },
  titleLine: {
    fontSize: TYPOGRAPHY.fontSize.base,
    fontWeight: TYPOGRAPHY.fontWeight.bold,
    color: COLORS.cyan,
    marginBottom: 6,
  },
  cardHeaderLine: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    fontWeight: TYPOGRAPHY.fontWeight.bold,
    color: COLORS.textPrimary,
    marginTop: 4,
    marginBottom: 2,
  },
  bulletLine: {
    fontSize: TYPOGRAPHY.fontSize.xs + 1,
    color: COLORS.textSecondary,
    marginLeft: 4,
  },
  timestamp: {
    fontSize: 10,
    marginTop: 6,
  },
  userTimestamp: {
    color: 'rgba(255, 255, 255, 0.7)',
    alignSelf: 'flex-end',
  },
  botTimestamp: {
    color: COLORS.textTertiary,
    alignSelf: 'flex-end',
  },
});