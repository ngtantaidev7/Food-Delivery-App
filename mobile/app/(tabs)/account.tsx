import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import {
  MapPin,
  CreditCard,
  Ticket,
  Bell,
  HelpCircle,
  LogOut,
  ChevronRight,
  Bot,
  Shield,
} from 'lucide-react-native';
import Colors from '@/constants/colors';

export default function AccountScreen() {
  const router = useRouter();

  const menuItems = [
    {
      icon: <Bot color="#00BDD6" size={20} />,
      title: 'AI Food Chatbot & Recommender',
      subtitle: 'Gemini-powered food assistant',
      route: '/ai-chat',
    },
    {
      icon: <MapPin color="#00BDD6" size={20} />,
      title: 'Saved Addresses',
      subtitle: '201 Katlian No.21 Street (Home)',
      route: '/checkout/location',
    },
    {
      icon: <Ticket color="#00BDD6" size={20} />,
      title: 'Vouchers & Offers',
      subtitle: '5 available discounts',
      route: '/checkout/offers',
    },
    {
      icon: <CreditCard color="#00BDD6" size={20} />,
      title: 'Payment Methods',
      subtitle: 'E-wallet, Cash',
      route: null,
    },
    {
      icon: <Shield color="#00BDD6" size={20} />,
      title: 'Security & Privacy',
      subtitle: 'Manage account security',
      route: null,
    },
    {
      icon: <HelpCircle color="#00BDD6" size={20} />,
      title: 'Help Center & Support',
      subtitle: 'FAQ and 24/7 customer service',
      route: null,
    },
  ];

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* ── User Header ── */}
      <View style={styles.profileHeader}>
        <Image
          source={{
            uri: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=400&q=80',
          }}
          style={styles.avatar}
        />
        <View style={styles.profileInfo}>
          <Text style={styles.userName}>Tai Nguyen</Text>
          <Text style={styles.userPhone}>+84 901 234 567</Text>
          <Text style={styles.userEmail}>customer@gmail.com</Text>
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.menuGroup}>
          {menuItems.map((item, idx) => (
            <TouchableOpacity
              key={idx}
              style={styles.menuRow}
              activeOpacity={0.7}
              onPress={() => {
                if (item.route) router.push(item.route as any);
              }}
            >
              <View style={styles.iconCircle}>{item.icon}</View>
              <View style={styles.menuDetails}>
                <Text style={styles.menuTitle}>{item.title}</Text>
                <Text style={styles.menuSubtitle}>{item.subtitle}</Text>
              </View>
              <ChevronRight color="#A0AEC0" size={18} />
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity style={styles.logoutBtn} activeOpacity={0.8}>
          <LogOut color="#FF4D4F" size={18} style={{ marginRight: 8 }} />
          <Text style={styles.logoutText}>Log Out</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
  },
  avatar: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: '#EEEEEE',
  },
  profileInfo: {
    marginLeft: 16,
  },
  userName: {
    fontSize: 18,
    fontWeight: '800',
    color: Colors.text,
  },
  userPhone: {
    fontSize: 13,
    color: Colors.textSecondary,
    marginTop: 3,
  },
  userEmail: {
    fontSize: 12,
    color: Colors.textMuted,
    marginTop: 2,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 32,
  },
  menuGroup: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#EEEEEE',
    overflow: 'hidden',
  },
  menuRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  iconCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#E0F8FB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuDetails: {
    flex: 1,
    marginLeft: 14,
  },
  menuTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.text,
  },
  menuSubtitle: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 24,
    backgroundColor: '#FFF0F0',
    borderRadius: 12,
    paddingVertical: 14,
  },
  logoutText: {
    color: '#FF4D4F',
    fontSize: 15,
    fontWeight: '700',
  },
});
