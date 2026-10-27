import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import Colors from '@/constants/colors';
import { ChatMessage } from '@/types/chat';

interface ChatBubbleProps {
  message: ChatMessage;
  isCurrentUser: boolean;
}

export const ChatBubble: React.FC<ChatBubbleProps> = ({
  message,
  isCurrentUser,
}) => {
  return (
    <View
      style={[
        styles.container,
        isCurrentUser ? styles.containerRight : styles.containerLeft,
      ]}
    >
      <View
        style={[
          styles.bubble,
          isCurrentUser ? styles.bubbleRight : styles.bubbleLeft,
        ]}
      >
        {message.attachmentUrl && (
          <Image
            source={{ uri: message.attachmentUrl }}
            style={styles.attachment}
            resizeMode="cover"
          />
        )}
        {message.text ? (
          <Text
            style={[
              styles.text,
              isCurrentUser ? styles.textRight : styles.textLeft,
            ]}
          >
            {message.text}
          </Text>
        ) : null}
      </View>
      <Text style={styles.time}>
        {new Date(message.createdAt).toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
        })}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 4,
    maxWidth: '75%',
  },
  containerRight: {
    alignSelf: 'flex-end',
    alignItems: 'flex-end',
  },
  containerLeft: {
    alignSelf: 'flex-start',
    alignItems: 'flex-start',
  },
  bubble: {
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  bubbleRight: {
    backgroundColor: Colors.primary,
    borderBottomRightRadius: 2,
  },
  bubbleLeft: {
    backgroundColor: '#F0F0F0',
    borderBottomLeftRadius: 2,
  },
  attachment: {
    width: 180,
    height: 120,
    borderRadius: 8,
    marginBottom: 6,
  },
  text: {
    fontSize: 14,
    lineHeight: 20,
  },
  textRight: {
    color: '#FFFFFF',
  },
  textLeft: {
    color: Colors.text,
  },
  time: {
    fontSize: 10,
    color: Colors.textMuted,
    marginTop: 2,
    marginHorizontal: 4,
  },
});
