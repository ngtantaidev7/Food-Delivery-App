import React, { useState } from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import Colors from '@/constants/colors';

interface ChatInputBarProps {
  onSend: (text: string) => void;
  onPickImage?: () => void;
  sending?: boolean;
}

export const ChatInputBar: React.FC<ChatInputBarProps> = ({
  onSend,
  onPickImage,
  sending = false,
}) => {
  const [text, setText] = useState('');

  const handleSend = () => {
    const trimmed = text.trim();
    if (!trimmed || sending) return;
    onSend(trimmed);
    setText('');
  };

  return (
    <View style={styles.container}>
      {onPickImage && (
        <TouchableOpacity
          onPress={onPickImage}
          style={styles.attachButton}
          activeOpacity={0.7}
        >
          <Text style={styles.attachIcon}>📷</Text>
        </TouchableOpacity>
      )}

      <TextInput
        value={text}
        onChangeText={setText}
        placeholder="Type a message..."
        placeholderTextColor={Colors.textMuted}
        style={styles.input}
        multiline
      />

      <TouchableOpacity
        onPress={handleSend}
        disabled={!text.trim() || sending}
        style={[
          styles.sendButton,
          (!text.trim() || sending) && styles.sendButtonDisabled,
        ]}
        activeOpacity={0.8}
      >
        {sending ? (
          <ActivityIndicator size="small" color="#FFFFFF" />
        ) : (
          <Text style={styles.sendIcon}>➤</Text>
        )}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  attachButton: {
    padding: 8,
    marginRight: 6,
  },
  attachIcon: {
    fontSize: 20,
  },
  input: {
    flex: 1,
    backgroundColor: '#F7F7F7',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    maxHeight: 100,
    fontSize: 15,
    color: Colors.text,
  },
  sendButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
  },
  sendButtonDisabled: {
    backgroundColor: '#D1D5DB',
  },
  sendIcon: {
    color: '#FFFFFF',
    fontSize: 14,
    transform: [{ rotate: '-45deg' }],
  },
});
