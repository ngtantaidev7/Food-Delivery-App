import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Image,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import {
  ArrowLeft,
  Video,
  Phone,
  ChevronRight,
  Smile,
  Send,
  Image as ImageIcon,
} from 'lucide-react-native';
import Colors from '@/constants/colors';

interface Message {
  id: string;
  sender: 'driver' | 'user';
  text?: string;
  imageUrl?: string;
  time: string;
}

export default function DriverChatScreen() {
  const router = useRouter();
  const { driverId } = useLocalSearchParams<{ driverId: string }>();

  const [inputMessage, setInputMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'm1',
      sender: 'driver',
      text: 'Hi, the restaurant is quite busy now so the delivery may be late 15 mins. Please wait for me.',
      time: '12:03',
    },
    {
      id: 'm2',
      sender: 'user',
      text: 'Sure! Thank you',
      time: '12:03',
    },
    {
      id: 'm3',
      sender: 'user',
      text: 'Could you please ask the restaurant to give me cutlery? I just need these items.',
      time: '12:04',
    },
    {
      id: 'm4',
      sender: 'user',
      imageUrl: 'https://images.unsplash.com/photo-1584269600464-37b1b58a9fe7?auto=format&fit=crop&w=500&q=80',
      time: '12:04',
    },
    {
      id: 'm5',
      sender: 'driver',
      text: 'Yes, let me tell the restaurant.',
      time: 'Just now',
    },
  ]);

  const handleSendMessage = () => {
    if (!inputMessage.trim()) return;

    const newMsg: Message = {
      id: `msg_${Date.now()}`,
      sender: 'user',
      text: inputMessage.trim(),
      time: 'Just now',
    };

    setMessages([...messages, newMsg]);
    setInputMessage('');
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      {/* ── Top Header (Page 11 PDF) ── */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <TouchableOpacity
            style={styles.backBtn}
            onPress={() => router.back()}
            activeOpacity={0.7}
          >
            <ArrowLeft color="#1E2022" size={20} />
          </TouchableOpacity>

          <View style={styles.driverAvatar}>
            <Text style={styles.avatarLetter}>J</Text>
          </View>

          <View style={styles.driverMeta}>
            <Text style={styles.driverName}>John Cooper</Text>
            <Text style={styles.activeStatus}>Active now</Text>
          </View>
        </View>

        <View style={styles.headerRight}>
          <TouchableOpacity style={styles.actionIconBtn} activeOpacity={0.7}>
            <Video color="#00BDD6" size={22} />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.actionIconBtn}
            activeOpacity={0.7}
            onPress={() => router.push(`/communication/call/${driverId || 'john'}`)}
          >
            <Phone color="#00BDD6" size={20} />
          </TouchableOpacity>
        </View>
      </View>

      {/* ── Chat Messages (Page 11 PDF) ── */}
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.messagesList}
        >
          {messages.map((item) => {
            const isUser = item.sender === 'user';

            return (
              <View
                key={item.id}
                style={[
                  styles.messageRow,
                  isUser ? styles.messageRowUser : styles.messageRowDriver,
                ]}
              >
                {!isUser && (
                  <View style={styles.bubbleAvatarDriver}>
                    <Text style={styles.bubbleAvatarLetter}>J</Text>
                  </View>
                )}

                <View style={styles.bubbleContentWrapper}>
                  {item.text ? (
                    <View
                      style={[
                        styles.bubble,
                        isUser ? styles.bubbleUser : styles.bubbleDriver,
                      ]}
                    >
                      <Text
                        style={[
                          styles.bubbleText,
                          isUser ? styles.bubbleTextUser : styles.bubbleTextDriver,
                        ]}
                      >
                        {item.text}
                      </Text>
                    </View>
                  ) : null}

                  {item.imageUrl ? (
                    <Image
                      source={{ uri: item.imageUrl }}
                      style={styles.cutleryImage}
                      resizeMode="cover"
                    />
                  ) : null}

                  <Text
                    style={[
                      styles.timestampText,
                      isUser ? styles.timeRight : styles.timeLeft,
                    ]}
                  >
                    {item.time}
                  </Text>
                </View>

                {isUser && item.text === 'Sure! Thank you' && (
                  <View style={styles.userAvatarWrapper}>
                    <Image
                      source={{
                        uri: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
                      }}
                      style={styles.userAvatar}
                    />
                    <View style={styles.onlineDot} />
                  </View>
                )}
              </View>
            );
          })}
        </ScrollView>

        {/* ── Input Bar (Page 11 PDF) ── */}
        <View style={styles.inputContainer}>
          <TouchableOpacity style={styles.expandBtn} activeOpacity={0.7}>
            <ChevronRight color="#00BDD6" size={20} />
          </TouchableOpacity>

          <TextInput
            placeholder="Type a message"
            placeholderTextColor={Colors.textMuted}
            value={inputMessage}
            onChangeText={setInputMessage}
            style={styles.textInput}
            onSubmitEditing={handleSendMessage}
            returnKeyType="send"
          />

          <TouchableOpacity style={styles.iconBtn} activeOpacity={0.7}>
            <Smile color="#00BDD6" size={20} />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.sendBtn}
            onPress={handleSendMessage}
            activeOpacity={0.8}
          >
            <Send color="#00BDD6" size={20} />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backBtn: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 6,
  },
  driverAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#00BDD6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarLetter: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  driverMeta: {
    marginLeft: 10,
  },
  driverName: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.text,
  },
  activeStatus: {
    fontSize: 11,
    color: Colors.textMuted,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  actionIconBtn: {
    padding: 4,
  },
  messagesList: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    gap: 12,
  },
  messageRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
  },
  messageRowDriver: {
    justifyContent: 'flex-start',
  },
  messageRowUser: {
    justifyContent: 'flex-end',
  },
  bubbleAvatarDriver: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#00BDD6',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 4,
  },
  bubbleAvatarLetter: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
  bubbleContentWrapper: {
    maxWidth: '75%',
  },
  bubble: {
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  bubbleDriver: {
    backgroundColor: '#F3F4F6',
    borderTopLeftRadius: 4,
  },
  bubbleUser: {
    backgroundColor: '#A0EFF5',
    borderTopRightRadius: 4,
  },
  bubbleText: {
    fontSize: 14,
    lineHeight: 20,
  },
  bubbleTextDriver: {
    color: Colors.text,
  },
  bubbleTextUser: {
    color: '#0F4850',
    fontWeight: '500',
  },
  cutleryImage: {
    width: 170,
    height: 170,
    borderRadius: 12,
    marginTop: 6,
  },
  timestampText: {
    fontSize: 10,
    color: Colors.textMuted,
    marginTop: 4,
  },
  timeRight: {
    textAlign: 'right',
  },
  timeLeft: {
    textAlign: 'left',
  },
  userAvatarWrapper: {
    position: 'relative',
    marginTop: 4,
  },
  userAvatar: {
    width: 28,
    height: 28,
    borderRadius: 14,
  },
  onlineDot: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#10B981',
    borderWidth: 1.5,
    borderColor: '#FFFFFF',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: '#EEEEEE',
    backgroundColor: '#FFFFFF',
    gap: 8,
  },
  expandBtn: {
    padding: 6,
  },
  textInput: {
    flex: 1,
    backgroundColor: '#F9FAFB',
    borderRadius: 20,
    paddingHorizontal: 16,
    height: 40,
    fontSize: 14,
    color: Colors.text,
  },
  iconBtn: {
    padding: 6,
  },
  sendBtn: {
    padding: 6,
  },
});
