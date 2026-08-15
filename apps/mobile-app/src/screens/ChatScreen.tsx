import React, { useState, useEffect, useRef } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator, StatusBar, KeyboardAvoidingView, Platform, TouchableOpacity, SafeAreaView, ScrollView } from 'react-native';
import ChatBubble from '../components/ChatBubble';
import InputField from '../components/InputField';
import { fetchMessages, sendMessage } from '../services/api';
import { Message } from '../types';
import { COLORS, TYPOGRAPHY, SPACING, RADIUS } from '../utils/constants';

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
        <ActivityIndicator size="small" color={COLORS.cyan} />
        <Text style={styles.loadingText}>Connecting to Synexis AI...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.background} />

      <KeyboardAvoidingView 
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backBtn}
            onPress={() => navigation.goBack()}
            activeOpacity={0.7}
          >
            <Text style={styles.backIcon}>‹</Text>
            <Text style={styles.backText}>Home</Text>
          </TouchableOpacity>

          <View style={styles.headerTitleContainer}>
            <Text style={styles.headerTitle}>Transit Assistant</Text>
            <Text style={styles.headerSub}>RAG AI Engine • Synexis</Text>
          </View>

          <TouchableOpacity onPress={handleClear} activeOpacity={0.7}>
            <Text style={styles.clearText}>Clear</Text>
          </TouchableOpacity>
        </View>



        {/* Messages List */}
        <View style={styles.messagesArea}>
          {messages.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyTitle}>Ask Synexis AI</Text>
              <Text style={styles.emptySub}>Query bus routes, train times, and schedules across Sri Lanka.</Text>
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
              <ActivityIndicator size="small" color={COLORS.cyan} />
              <Text style={styles.typingText}>Retrieving transit schedules...</Text>
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
    color: COLORS.cyan,
    fontWeight: 'bold',
    marginTop: -2,
  },
  backText: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    color: COLORS.cyan,
    fontWeight: TYPOGRAPHY.fontWeight.semibold,
  },
  headerTitleContainer: {
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: TYPOGRAPHY.fontSize.base,
    fontWeight: TYPOGRAPHY.fontWeight.bold,
    color: COLORS.textPrimary,
  },
  headerSub: {
    fontSize: 10,
    color: COLORS.textSecondary,
  },
  clearText: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    color: COLORS.textTertiary,
  },
  chipsRow: {
    backgroundColor: COLORS.surface,
    paddingVertical: SPACING.xs,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
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
