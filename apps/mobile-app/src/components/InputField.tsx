import React, { useState } from 'react';
import { View, TextInput, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, TYPOGRAPHY, SPACING, RADIUS, SHADOWS } from '../utils/constants';

interface InputFieldProps {
  onSend: (message: string) => void;
}

export default function InputField({ onSend }: InputFieldProps) {
  const [text, setText] = useState('');

  const handleSend = () => {
    if (text.trim()) {
      onSend(text);
      setText('');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.inputWrapper}>
        <TextInput
          style={styles.input}
          value={text}
          onChangeText={setText}
          placeholder="Ask about bus times, trains, or routes..."
          placeholderTextColor={COLORS.textTertiary}
          onSubmitEditing={handleSend}
          returnKeyType="send"
          multiline
          maxLength={500}
        />
      </View>
      <TouchableOpacity 
        onPress={handleSend}
        disabled={!text.trim()}
        activeOpacity={0.8}
      >
        <LinearGradient
          colors={text.trim() ? [COLORS.primary, COLORS.primaryDark] : ['#CBD5E1', '#94A3B8']}
          style={styles.sendButton}
        >
          <Text style={styles.sendIcon}>➔</Text>
        </LinearGradient>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    backgroundColor: COLORS.surface,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  inputWrapper: {
    flex: 1,
    backgroundColor: COLORS.surfaceSubtle,
    borderRadius: RADIUS.xl,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs + 2,
    marginRight: SPACING.sm,
    maxHeight: 110,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  input: {
    fontSize: TYPOGRAPHY.fontSize.base,
    color: COLORS.textPrimary,
    lineHeight: TYPOGRAPHY.lineHeight.normal * TYPOGRAPHY.fontSize.base,
    minHeight: 36,
  },
  sendButton: {
    width: 44,
    height: 44,
    borderRadius: RADIUS.full,
    justifyContent: 'center',
    alignItems: 'center',
    ...SHADOWS.md,
  },
  sendIcon: {
    fontSize: 18,
    color: COLORS.textInverse,
    fontWeight: 'bold',
  },
});
