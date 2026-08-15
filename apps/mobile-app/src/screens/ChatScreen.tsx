import React, { useState, useEffect, useRef } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator, StatusBar, KeyboardAvoidingView, Platform, TouchableOpacity, SafeAreaView, ScrollView } from 'react-native';
import ChatBubble from '../components/ChatBubble';
import InputField from '../components/InputField';
import { fetchMessages, sendMessage } from '../services/api';
import { Message } from '../types';
import { COLORS, TYPOGRAPHY, SPACING, RADIUS, QUICK_PROMPTS } from '../utils/constants';

export default function ChatScreen({ navigation }: any) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const flatListRef = useRef<FlatList>(null);

  useEffect(() => {
    const loadMessages = async () => {
      const fetchedMessages = await fetchMessages();
      setMessages(fetchedMessages);
      setLoading(false);
    };

    loadMessages();
  }, []);

  const handleSend = async (newMessage: string) => {
    if (!newMessage.trim() || isSending) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      content: newMessage,
      sender: {
        id: 'user-1',
        name: 'User',
        language: 'English'
      },
      timestamp: new Date()
    };

    setMessages((prev) => [userMsg, ...prev]);
    setIsSending(true);

    try {
      const response = await sendMessage(newMessage);
      const botText = response?.response || 'No schedule information returned.';

      const botMsg: Message = {
        id: (Date.now() + 1).toString(),
        content: botText,
        sender: {
          id: 'bot-1',
          name: 'Assistant',
          language: 'English'
        },
        timestamp: new Date()
      };

      setMessages((prev) => [botMsg, ...prev]);
    } catch (error) {
      console.error('Error sending message:', error);
      const errorMsg: Message = {
        id: (Date.now() + 1).toString(),
        content: 'Unable to connect to server. Please try again.',
        sender: {
          id: 'bot-1',
          name: 'Assistant',
          language: 'English'
        },
        timestamp: new Date()
      };
      setMessages((prev) => [errorMsg, ...prev]);
    } finally {
      setIsSending(false);
    }
  };

  const handleClear = () => {
    setMessages([]);
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="small" color={COLORS.primary} />
        <Text style={styles.loadingText}>Loading...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" />

      <KeyboardAvoidingView 
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        {/* Simple Header */}
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backBtn}
            onPress={() => navigation.goBack()}
            activeOpacity={0.7}
          >
            <Text style={styles.backIcon}>‹</Text>
            <Text style={styles.backText}>Back</Text>
          </TouchableOpacity>

          <Text style={styles.headerTitle}>Transit Assistant</Text>

          <TouchableOpacity onPress={handleClear} activeOpacity={0.7}>
            <Text style={styles.clearText}>Clear</Text>
          </TouchableOpacity>
        </View>

        {/* Quick Suggestion Chips */}
        <View style={styles.chipsRow}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chipsScroll}>
            {QUICK_PROMPTS.map((prompt: any) => (
              <TouchableOpacity
                key={prompt.id}
                style={styles.chip}
                onPress={() => handleSend(prompt.query)}
                disabled={isSending}
                activeOpacity={0.7}
              >
                <Text style={styles.chipText}>{prompt.title}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Messages List */}
        <View style={styles.messagesArea}>
          {messages.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyTitle}>Ask a Question</Text>
              <Text style={styles.emptySub}>Ask for bus or train schedules across Sri Lanka.</Text>
            </View>
          ) : (
            <FlatList
              ref={flatListRef}
              data={messages}
              renderItem={({ item }) => <ChatBubble message={item} />}
              keyExtractor={(item) => item.id}
              inverted
              contentContainerStyle={styles.messagesList}
            />
          )}

          {isSending && (
            <View style={styles.typingRow}>
              <ActivityIndicator size="small" color={COLORS.primary} />
              <Text style={styles.typingText}>Searching schedules...</Text>
            </View>
          )}
        </View>

        {/* Input Bar */}
        <InputField onSend={handleSend} />
      </KeyboardAvoidingView>
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
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm + 2,
    backgroundColor: COLORS.surface,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  backBtn: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backIcon: {
    fontSize: 24,
    color: COLORS.primary,
    fontWeight: 'bold',
    marginTop: -2,
  },
  backText: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    color: COLORS.primary,
    fontWeight: TYPOGRAPHY.fontWeight.medium,
  },
  headerTitle: {
    fontSize: TYPOGRAPHY.fontSize.base,
    fontWeight: TYPOGRAPHY.fontWeight.bold,
    color: COLORS.textPrimary,
  },
  clearText: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    color: COLORS.textTertiary,
  },
  chipsRow: {
    backgroundColor: COLORS.surface,
    paddingVertical: SPACING.xs,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderLight,
  },
  chipsScroll: {
    paddingHorizontal: SPACING.md,
    gap: SPACING.xs,
  },
  chip: {
    backgroundColor: COLORS.surfaceSubtle,
    paddingHorizontal: SPACING.sm + 2,
    paddingVertical: 6,
    borderRadius: RADIUS.full,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  chipText: {
    fontSize: TYPOGRAPHY.fontSize.xs,
    color: COLORS.textSecondary,
    fontWeight: TYPOGRAPHY.fontWeight.medium,
  },
  messagesArea: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  messagesList: {
    paddingVertical: SPACING.sm,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: SPACING.xl,
  },
  emptyTitle: {
    fontSize: TYPOGRAPHY.fontSize.lg,
    fontWeight: TYPOGRAPHY.fontWeight.bold,
    color: COLORS.textPrimary,
    marginBottom: 4,
  },
  emptySub: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
  typingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
  },
  typingText: {
    fontSize: TYPOGRAPHY.fontSize.xs,
    color: COLORS.textSecondary,
    marginLeft: SPACING.xs,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.background,
  },
  loadingText: {
    marginTop: SPACING.xs,
    fontSize: TYPOGRAPHY.fontSize.sm,
    color: COLORS.textSecondary,
  },
});
