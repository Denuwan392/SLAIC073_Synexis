import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Message } from '../types';
import { COLORS, TYPOGRAPHY, SPACING, RADIUS, SHADOWS } from '../utils/constants';

interface ChatBubbleProps {
  message: Message;
}

export default function ChatBubble({ message }: ChatBubbleProps) {
  const isUser = message.sender.name === 'User';
  
  return (
    <View style={[styles.container, isUser ? styles.userContainer : styles.botContainer]}>
      <View style={[styles.bubble, isUser ? styles.userBubble : styles.botBubble]}>
        {!isUser && (
          <View style={styles.botHeader}>
            <Text style={styles.botIcon}>🤖</Text>
            <Text style={styles.botName}>AI Assistant</Text>
          </View>
        )}
        <Text style={[styles.messageText, isUser ? styles.userText : styles.botText]}>
          {message.content}
        </Text>
        <Text style={[styles.timestamp, isUser ? styles.userTimestamp : styles.botTimestamp]}>
          {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
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
    maxWidth: '80%',
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
  },
  userBubble: {
    backgroundColor: COLORS.userMessage,
    borderBottomRightRadius: SPACING.xs,
    ...SHADOWS.md,
  },
  botBubble: {
    backgroundColor: COLORS.botMessage,
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
  botIcon: {
    fontSize: TYPOGRAPHY.fontSize.lg,
    marginRight: SPACING.xs,
  },
  botName: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    fontWeight: TYPOGRAPHY.fontWeight.semibold,
    color: COLORS.primary,
  },
  messageText: {
    fontSize: TYPOGRAPHY.fontSize.base,
    lineHeight: TYPOGRAPHY.lineHeight.relaxed * TYPOGRAPHY.fontSize.base,
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
    fontSize: TYPOGRAPHY.fontSize.xs,
    marginTop: SPACING.xs,
    fontWeight: TYPOGRAPHY.fontWeight.medium,
  },
  userTimestamp: {
    color: COLORS.primaryLight,
    alignSelf: 'flex-end',
  },
  botTimestamp: {
    color: COLORS.textTertiary,
    alignSelf: 'flex-end',
  },
});