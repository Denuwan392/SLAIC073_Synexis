import React, { useState, useEffect, useRef } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator, StatusBar, KeyboardAvoidingView, Platform, TouchableOpacity, SafeAreaView, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import ChatBubble from '../components/ChatBubble';
import InputField from '../components/InputField';
import { fetchMessages, sendMessage } from '../services/api';
import { Message } from '../types';
import { COLORS, TYPOGRAPHY, SPACING, RADIUS, SHADOWS, QUICK_PROMPTS } from '../utils/constants';

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

    // Prepend user message so inverted FlatList shows it at the bottom
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
        content: '⚠️ Network Error: Unable to reach transit service. Please check your backend connection.',
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

  const handleClearChat = () => {
    setMessages([]);
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
        <Text style={styles.loadingText}>Initializing Synexis AI...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeContainer}>
      <StatusBar barStyle="dark-content" />

      <KeyboardAvoidingView 
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
      >
        {/* Custom Header Bar */}
        <View style={styles.headerBar}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => navigation.goBack()}
            activeOpacity={0.7}
          >
            <Text style={styles.backIcon}>‹</Text>
            <Text style={styles.backText}>Back</Text>
          </TouchableOpacity>

          <View style={styles.headerTitleContainer}>
            <Text style={styles.headerTitle}>Synexis Assistant</Text>
            <View style={styles.onlineBadge}>
              <View style={styles.onlineDot} />
              <Text style={styles.onlineText}>Gemini 2.5 AI</Text>
            </View>
          </View>

          <TouchableOpacity 
            style={styles.clearButton}
            onPress={handleClearChat}
            activeOpacity={0.7}
          >
            <Text style={styles.clearText}>Clear</Text>
          </TouchableOpacity>
        </View>

        {/* Suggestion Chips Header */}
        <View style={styles.chipsContainer}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chipsScroll}>
            {QUICK_PROMPTS.map((prompt) => (
              <TouchableOpacity
                key={prompt.id}
                style={styles.chipButton}
                onPress={() => handleSend(prompt.query)}
                disabled={isSending}
                activeOpacity={0.7}
              >
                <Text style={styles.chipText}>{prompt.title}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Chat Messages Area */}
        <View style={styles.messagesContainer}>
          {messages.length === 0 ? (
            <View style={styles.emptyState}>
              <View style={styles.emptyIconCircle}>
                <Text style={styles.emptyEmoji}>🤖</Text>
              </View>
              <Text style={styles.emptyTitle}>Ask Anything About Transit</Text>
              <Text style={styles.emptySubtitle}>
                Get instant bus timetables, express train schedules, and live route tracking across Sri Lanka.
              </Text>
              
              <View style={styles.sampleBox}>
                <Text style={styles.sampleHeader}>TRY ASKING:</Text>
                <TouchableOpacity onPress={() => handleSend('Bus schedules from Colombo to Kandy')}>
                  <Text style={styles.sampleItem}>• "Bus schedules from Colombo to Kandy"</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handleSend('Morning express trains to Galle')}>
                  <Text style={styles.sampleItem}>• "Morning express trains to Galle"</Text>
                </TouchableOpacity>
              </View>
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

          {/* Thinking Indicator */}
          {isSending && (
            <View style={styles.typingIndicator}>
              <ActivityIndicator size="small" color={COLORS.primary} />
              <Text style={styles.typingText}>Searching transit databases...</Text>
            </View>
          )}
        </View>

        {/* Floating Input Bar */}
        <InputField onSend={handleSend} />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeContainer: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  container: {
    flex: 1,
  },
  headerBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    backgroundColor: COLORS.surface,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    ...SHADOWS.sm,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingRight: SPACING.xs,
  },
  backIcon: {
    fontSize: 28,
    color: COLORS.primary,
    fontWeight: 'bold',
    marginTop: -2,
  },
  backText: {
    fontSize: TYPOGRAPHY.fontSize.base,
    color: COLORS.primary,
    fontWeight: TYPOGRAPHY.fontWeight.medium,
  },
  headerTitleContainer: {
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: TYPOGRAPHY.fontSize.base,
    fontWeight: TYPOGRAPHY.fontWeight.bold,
    color: COLORS.textPrimary,
  },
  onlineBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  onlineDot: {
    width: 6,
    height: 6,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.secondary,
    marginRight: 4,
  },
  onlineText: {
    fontSize: 11,
    color: COLORS.textSecondary,
    fontWeight: TYPOGRAPHY.fontWeight.medium,
  },
  clearButton: {
    paddingHorizontal: SPACING.xs,
  },
  clearText: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    color: COLORS.textTertiary,
    fontWeight: TYPOGRAPHY.fontWeight.semibold,
  },
  chipsContainer: {
    backgroundColor: COLORS.surface,
    paddingVertical: SPACING.xs + 2,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderLight,
  },
  chipsScroll: {
    paddingHorizontal: SPACING.md,
    gap: SPACING.xs,
  },
  chipButton: {
    backgroundColor: COLORS.surfaceSubtle,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
    borderRadius: RADIUS.full,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  chipText: {
    fontSize: TYPOGRAPHY.fontSize.xs,
    fontWeight: TYPOGRAPHY.fontWeight.medium,
    color: COLORS.textPrimary,
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
  emptyIconCircle: {
    width: 70,
    height: 70,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.primaryGlow,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  emptyEmoji: {
    fontSize: 34,
  },
  emptyTitle: {
    fontSize: TYPOGRAPHY.fontSize.xl,
    fontWeight: TYPOGRAPHY.fontWeight.bold,
    color: COLORS.textPrimary,
    marginBottom: SPACING.xs,
    textAlign: 'center',
  },
  emptySubtitle: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    color: COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: TYPOGRAPHY.lineHeight.normal * TYPOGRAPHY.fontSize.sm,
    marginBottom: SPACING.lg,
  },
  sampleBox: {
    width: '100%',
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    ...SHADOWS.sm,
  },
  sampleHeader: {
    fontSize: 10,
    fontWeight: TYPOGRAPHY.fontWeight.bold,
    color: COLORS.primary,
    letterSpacing: 0.8,
    marginBottom: SPACING.xs,
  },
  sampleItem: {
    fontSize: TYPOGRAPHY.fontSize.xs,
    color: COLORS.textSecondary,
    marginVertical: 4,
    fontWeight: TYPOGRAPHY.fontWeight.medium,
  },
  typingIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: COLORS.surface,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs + 2,
    borderRadius: RADIUS.full,
    marginHorizontal: SPACING.md,
    marginVertical: SPACING.xs,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  typingText: {
    fontSize: TYPOGRAPHY.fontSize.xs,
    color: COLORS.textSecondary,
    marginLeft: SPACING.xs,
    fontWeight: TYPOGRAPHY.fontWeight.medium,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.background,
  },
  loadingText: {
    marginTop: SPACING.md,
    fontSize: TYPOGRAPHY.fontSize.sm,
    color: COLORS.textSecondary,
    fontWeight: TYPOGRAPHY.fontWeight.medium,
  },
});
