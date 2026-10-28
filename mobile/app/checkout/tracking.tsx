import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { ArrowLeft, Clock, MapPin, Phone, MessageSquare, Check } from 'lucide-react-native';
import Colors from '@/constants/colors';
import { DriverRouteMap } from '@/components/map/DriverRouteMap';
import { useOrderStore } from '@/stores/useOrderStore';

const { width } = Dimensions.get('window');

export default function OrderTrackingScreen() {
  const router = useRouter();
  const activeOrder = useOrderStore((s) => s.activeOrder);
  const driverLocationState = useOrderStore((s) => s.driverLocation);

  const driverId = 'john-cooper';
  const orderId = activeOrder?.id || 'ord_123';

  // Driver, Restaurant, Customer coordinates from Seed data
  const customerLocation = {
    latitude: 10.7769,
    longitude: 106.682,
  };

  const driverLocation = {
    latitude: driverLocationState?.coordinates?.[1] || 10.78,
    longitude: driverLocationState?.coordinates?.[0] || 106.685,
  };

  const restaurantLocation = {
    latitude: 10.779,
    longitude: 106.685,
  };

  return (
    <View style={styles.container}>
      {/* ── Top Half: Map View (Page 10 PDF) ── */}
      <View style={styles.mapContainer}>
        <DriverRouteMap
          customerLocation={customerLocation}
          driverLocation={driverLocation}
          restaurantLocation={restaurantLocation}
        />

        {/* Back navigation */}
        <SafeAreaView style={styles.navHeader} edges={['top']}>
          <TouchableOpacity
            style={styles.backCircleBtn}
            onPress={() => router.replace('/(tabs)')}
            activeOpacity={0.8}
          >
            <ArrowLeft color="#1E2022" size={20} />
          </TouchableOpacity>
        </SafeAreaView>
      </View>

      {/* ── Bottom Half: Sheet with Delivery Tracking (Page 10 PDF) ── */}
      <View style={styles.bottomSheet}>
        <Text style={styles.sheetTitle}>Delivery Tracking</Text>

        {/* Delivery Time Row */}
        <View style={styles.infoRow}>
          <View style={styles.iconCircle}>
            <Clock color="#00BDD6" size={18} />
          </View>
          <View>
            <Text style={styles.infoLabel}>Delivery time</Text>
            <Text style={styles.infoValue}>15-20 mins</Text>
          </View>
        </View>

        {/* Delivery Address Row */}
        <View style={styles.infoRow}>
          <View style={styles.iconCircle}>
            <MapPin color="#00BDD6" size={18} />
          </View>
          <View>
            <Text style={styles.infoLabel}>Delivery Address</Text>
            <Text style={styles.infoValue}>
              {activeOrder?.deliveryAddress?.addressLine || '201 Katlian No.21 Street'}
            </Text>
          </View>
        </View>

        <View style={styles.divider} />

        {/* ── Driver Card (Page 10 PDF) ── */}
        <View style={styles.driverCard}>
          <View style={styles.driverAvatar}>
            <Text style={styles.driverAvatarText}>J</Text>
          </View>

          <View style={styles.driverDetails}>
            <Text style={styles.driverName}>John Cooper</Text>
            <Text style={styles.driverRole}>Food Delivery</Text>
          </View>

          <View style={styles.driverActions}>
            <TouchableOpacity
              style={styles.actionCircleBtn}
              activeOpacity={0.8}
              onPress={() => router.push(`/communication/call/${driverId}`)}
            >
              <Phone color="#00BDD6" size={18} />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.actionCircleBtn}
              activeOpacity={0.8}
              onPress={() => router.push(`/communication/chat/${driverId}`)}
            >
              <MessageSquare color="#00BDD6" size={18} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Action to complete order and rate */}
        <TouchableOpacity
          style={styles.completeOrderBtn}
          activeOpacity={0.9}
          onPress={() => router.push(`/rating/${orderId}`)}
        >
          <Check color="#FFFFFF" size={18} style={{ marginRight: 6 }} />
          <Text style={styles.completeOrderText}>Order Received & Rate</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  mapContainer: {
    flex: 1,
    position: 'relative',
  },
  navHeader: {
    position: 'absolute',
    top: 10,
    left: 16,
  },
  backCircleBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  bottomSheet: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 28,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 10,
  },
  sheetTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: Colors.text,
    marginBottom: 16,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    marginBottom: 14,
  },
  iconCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#E0F8FB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  infoLabel: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
  infoValue: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.text,
    marginTop: 2,
  },
  divider: {
    height: 1,
    backgroundColor: '#F3F4F6',
    marginVertical: 10,
  },
  driverCard: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
  },
  driverAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#00BDD6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  driverAvatarText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '800',
  },
  driverDetails: {
    flex: 1,
    marginLeft: 12,
  },
  driverName: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.text,
  },
  driverRole: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  driverActions: {
    flexDirection: 'row',
    gap: 10,
  },
  actionCircleBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#E0F8FB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  completeOrderBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#00BDD6',
    borderRadius: 10,
    height: 46,
    marginTop: 14,
  },
  completeOrderText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
});
