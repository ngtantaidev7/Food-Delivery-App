import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { MessageSquare, Bell, ChevronRight, Bot } from 'lucide-react-native';
import Colors from '@/constants/colors';

export default function InboxScreen() {
  const router = useRouter();

  const chats = [
    {
      id: 'driver-john',
      name: 'John Cooper (Driver)',
      lastMessage: 'Yes, let me tell the restaurant.',
      time: '12:05 PM',
      unread: 1,
      route: '/communication/chat/john-cooper',
    },
    {
      id: 'ai-bot',
      name: 'Gemini Food AI Assistant',
      lastMessage: 'I found 3 great chicken dishes near you!',
      time: '11:40 AM',
      unread: 0,
      route: '/ai-chat',
      isAi: true,
    },
    {
      id: 'hana-rest',
      name: 'Hana Chicken',
      lastMessage: 'Your order is being prepared with extra sauce.',
      time: 'Yesterday',
      unread: 0,
      route: '/communication/chat/hana-chicken',
    },
  ];

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Inbox</Text>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {chats.map((item) => (
          <TouchableOpacity
            key={item.id}
            style={styles.chatRow}
            activeOpacity={0.7}
            onPress={() => router.push(item.route as any)}
          >
            <View style={[styles.avatarBox, item.isAi && styles.avatarAi]}>
              {item.isAi ? (
                <Bot color="#00BDD6" size={22} />
              ) : (
                <Text style={styles.avatarLetter}>{item.name[0]}</Text>
              )}
            </View>

            <View style={styles.chatDetails}>
              <View style={styles.chatTop}>
                <Text style={styles.chatName}>{item.name}</Text>
                <Text style={styles.chatTime}>{item.time}</Text>
              </View>
              <Text style={styles.lastMessage} numberOfLines={1}>
                {item.lastMessage}
              </Text>
            </View>

            {item.unread > 0 && (
              <View style={styles.unreadBadge}>
                <Text style={styles.unreadText}>{item.unread}</Text>
              </View>
            )}
          </TouchableOpacity>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 14,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: Colors.text,
  },
  scrollContent: {
    paddingVertical: 10,
  },
  chatRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  avatarBox: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: '#00BDD6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarAi: {
    backgroundColor: '#E0F8FB',
    borderWidth: 1.5,
    borderColor: '#00BDD6',
  },
  avatarLetter: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
  },
  chatDetails: {
    flex: 1,
    marginLeft: 12,
  },
  chatTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  chatName: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.text,
  },
  chatTime: {
    fontSize: 11,
    color: Colors.textMuted,
  },
  lastMessage: {
    fontSize: 13,
    color: Colors.textSecondary,
    marginTop: 4,
  },
  unreadBadge: {
    backgroundColor: '#00BDD6',
    borderRadius: 10,
    width: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
  },
  unreadText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '800',
  },
});
