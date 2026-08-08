import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator, StatusBar, KeyboardAvoidingView, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import ChatBubble from '../components/ChatBubble';
import InputField from '../components/InputField';
import { fetchMessages, sendMessage } from '../services/api';
import { Message } from '../types';
import { COLORS, TYPOGRAPHY, SPACING } from '../utils/constants';

export default function ChatScreen() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadMessages = async () => {
      const fetchedMessages = await fetchMessages();
      setMessages(fetchedMessages);
      setLoading(false);
    };

    loadMessages();
  }, []);

  const handleSend = async (newMessage: string) => {
    const message: Message = {
      id: Date.now().toString(),
      content: newMessage,
      sender: {
        id: 'user-1',
        name: 'User',
        language: 'English'
      },
      timestamp: new Date()
    };

    setMessages((prevMessages) => [...prevMessages, message]);
    
    // Send the message content (string) to API
    try {
      const response = await sendMessage(newMessage);
      if (response && response.response) {
        const botMessage: Message = {
          id: Date.now().toString() + '-bot',
          content: response.response,
          sender: {
            id: 'bot-1',
            name: 'Assistant',
            language: 'English'
          },
          timestamp: new Date()
        };
        setMessages((prevMessages) => [...prevMessages, botMessage]);
      }
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
        <Text style={styles.loadingText}>Loading messages...</Text>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
    >
      <StatusBar barStyle="dark-content" />
      
      {/* Header */}
      <LinearGradient
        colors={[COLORS.primary, COLORS.primaryDark]}
        style={styles.header}
      >
        <Text style={styles.headerTitle}>💬 Chat Assistant</Text>
        <Text style={styles.headerSubtitle}>Ask about bus & train schedules</Text>
      </LinearGradient>

      {/* Messages List */}
      <View style={styles.messagesContainer}>
        {messages.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateEmoji}>👋</Text>
            <Text style={styles.emptyStateTitle}>Start a conversation!</Text>
            <Text style={styles.emptyStateText}>
              Ask me about bus or train schedules, routes, and more.
            </Text>
          </View>
        ) : (
          <FlatList
            data={messages}
            renderItem={({ item }) => <ChatBubble message={item} />}
            keyExtractor={(item) => item.id}
            inverted
            contentContainerStyle={styles.messagesList}
          />
        )}
      </View>

      {/* Input Field */}
      <View style={styles.inputContainer}>
        <InputField onSend={handleSend} />
      </View>
    </KeyboardAvoidingView>
  );
};

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
  messagesContainer: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  messagesList: {
    paddingVertical: SPACING.md,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: SPACING.xl,
  },
  emptyStateEmoji: {
    fontSize: 64,
    marginBottom: SPACING.md,
  },
  emptyStateTitle: {
    fontSize: TYPOGRAPHY.fontSize.xl,
    fontWeight: TYPOGRAPHY.fontWeight.bold,
    color: COLORS.textPrimary,
    marginBottom: SPACING.sm,
  },
  emptyStateText: {
    fontSize: TYPOGRAPHY.fontSize.base,
    color: COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: TYPOGRAPHY.lineHeight.relaxed * TYPOGRAPHY.fontSize.base,
  },
  inputContainer: {
    backgroundColor: COLORS.surface,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    paddingVertical: SPACING.sm,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.background,
  },
  loadingText: {
    marginTop: SPACING.md,
    fontSize: TYPOGRAPHY.fontSize.base,
    color: COLORS.textSecondary,
    fontWeight: TYPOGRAPHY.fontWeight.medium,
  },
});
