import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Clock, ChevronRight, CheckCircle2 } from 'lucide-react-native';
import Colors from '@/constants/colors';
import { getUserOrders } from '@/services/api';
import { useOrderStore } from '@/stores/useOrderStore';

export default function OrdersScreen() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [orders, setOrders] = useState<any[]>([]);
  const activeOrder = useOrderStore((s) => s.activeOrder);

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      setLoading(true);
      const res: any = await getUserOrders('current').catch(() => []);
      if (res && res.length > 0) {
        setOrders(res);
      } else {
        // Fallback default sample orders
        setOrders([
          {
            id: 'ord_hana_1',
            restaurantName: 'Hana Chicken',
            status: 'deliver',
            createdAt: 'Today, 12:30 PM',
            pricing: { totalAmount: 30.8 },
            items: [
              { foodName: 'Fried Chicken (L)', quantity: 1 },
              { foodName: 'Chicken Salad (M)', quantity: 1 },
            ],
            imageUrl: 'https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?auto=format&fit=crop&w=400&q=80',
          },
          {
            id: 'ord_bamsu_2',
            restaurantName: 'Bamsu Restaurant',
            status: 'arrived',
            createdAt: 'Yesterday, 07:15 PM',
            pricing: { totalAmount: 26.0 },
            items: [{ foodName: 'Chicken Sandwich', quantity: 1 }],
            imageUrl: 'https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=400&q=80',
          },
        ]);
      }
    } catch (err) {
      console.error('Fetch orders error:', err);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'deliver':
      case 'look_for_driver':
      case 'prepare_food':
        return {
          label: 'Delivering',
          bg: '#E0F8FB',
          text: '#00BDD6',
        };
      case 'arrived':
        return {
          label: 'Completed',
          bg: '#E6F9F0',
          text: '#00C48C',
        };
      case 'cancelled':
        return {
          label: 'Cancelled',
          bg: '#FFEAEA',
          text: '#FF4D4F',
        };
      default:
        return {
          label: status,
          bg: '#F3F4F6',
          text: '#6B7280',
        };
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>My Orders</Text>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {loading ? (
          <ActivityIndicator color={Colors.primary} style={{ marginTop: 30 }} />
        ) : (
          orders.map((order) => {
            const badge = getStatusBadge(order.status);
            const isOngoing = order.status !== 'arrived' && order.status !== 'cancelled';

            return (
              <View key={order.id || order._id} style={styles.orderCard}>
                <View style={styles.cardTop}>
                  <Image
                    source={{ uri: order.imageUrl || 'https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?auto=format&fit=crop&w=400&q=80' }}
                    style={styles.restImg}
                  />
                  <View style={styles.restInfo}>
                    <Text style={styles.restName}>{order.restaurantName}</Text>
                    <Text style={styles.orderDate}>{order.createdAt}</Text>
                    <View style={[styles.statusPill, { backgroundColor: badge.bg }]}>
                      <Text style={[styles.statusText, { color: badge.text }]}>
                        {badge.label}
                      </Text>
                    </View>
                  </View>
                  <Text style={styles.orderTotal}>
                    ${order.pricing?.totalAmount?.toFixed(1) || '30.8'}
                  </Text>
                </View>

                <View style={styles.divider} />

                {/* Items preview */}
                <View style={styles.itemsPreview}>
                  {(order.items || []).map((it: any, idx: number) => (
                    <Text key={idx} style={styles.itemLine}>
                      • {it.quantity}x {it.foodName}
                    </Text>
                  ))}
                </View>

                {/* Actions */}
                <View style={styles.actionsRow}>
                  {isOngoing ? (
                    <TouchableOpacity
                      style={styles.trackBtn}
                      activeOpacity={0.8}
                      onPress={() => router.push('/checkout/tracking')}
                    >
                      <Text style={styles.trackBtnText}>Track Order</Text>
                    </TouchableOpacity>
                  ) : (
                    <TouchableOpacity
                      style={styles.reorderBtn}
                      activeOpacity={0.8}
                      onPress={() => router.push('/rating/ord_hana_1')}
                    >
                      <Text style={styles.reorderBtnText}>Rate Order</Text>
                    </TouchableOpacity>
                  )}
                </View>
              </View>
            );
          })
        )}
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
    padding: 16,
    gap: 14,
  },
  orderCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: '#EEEEEE',
  },
  cardTop: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  restImg: {
    width: 60,
    height: 60,
    borderRadius: 10,
    backgroundColor: '#EEEEEE',
  },
  restInfo: {
    flex: 1,
    marginLeft: 12,
  },
  restName: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.text,
  },
  orderDate: {
    fontSize: 12,
    color: Colors.textMuted,
    marginTop: 2,
  },
  statusPill: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    alignSelf: 'flex-start',
    marginTop: 6,
  },
  statusText: {
    fontSize: 11,
    fontWeight: '700',
  },
  orderTotal: {
    fontSize: 16,
    fontWeight: '800',
    color: Colors.text,
  },
  divider: {
    height: 1,
    backgroundColor: '#F3F4F6',
    marginVertical: 12,
  },
  itemsPreview: {
    gap: 4,
  },
  itemLine: {
    fontSize: 13,
    color: Colors.textSecondary,
  },
  actionsRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 12,
  },
  trackBtn: {
    backgroundColor: '#00BDD6',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  trackBtnText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },
  reorderBtn: {
    backgroundColor: '#E0F8FB',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  reorderBtnText: {
    color: '#00BDD6',
    fontSize: 13,
    fontWeight: '700',
  },
});
