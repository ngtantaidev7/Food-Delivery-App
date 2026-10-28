import React, { useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { CheckCircle2, Search, X } from 'lucide-react-native';
import Colors from '@/constants/colors';
import { StepProgress } from '@/components/common/StepProgress';
import { useOrderStore } from '@/stores/useOrderStore';

export default function SearchingDriverScreen() {
  const router = useRouter();
  const activeOrder = useOrderStore((s) => s.activeOrder);
  const updateStatus = useOrderStore((s) => s.updateStatus);

  const pulseAnim = React.useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // Pulse animation for the magnifying glass
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.12,
          duration: 900,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 900,
          useNativeDriver: true,
        }),
      ])
    ).start();

    // Auto navigate to tracking screen after 4 seconds to simulate driver acceptance
    const timer = setTimeout(() => {
      updateStatus('deliver');
      router.replace('/checkout/tracking');
    }, 4500);

    return () => clearTimeout(timer);
  }, []);

  const handleCancel = () => {
    router.replace('/(tabs)');
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <View style={styles.content}>
        {/* ── Order confirmed status (Page 9 PDF) ── */}
        <View style={styles.statusBadge}>
          <CheckCircle2 color="#00BDD6" size={28} />
          <Text style={styles.statusText}>Order confirmed</Text>
        </View>

        {/* ── Big Title (Page 9 PDF) ── */}
        <Text style={styles.mainTitle}>Looking for driver</Text>

        {/* ── Magnifying Glass Circle (Page 9 PDF) ── */}
        <Animated.View style={[styles.glassWrapper, { transform: [{ scale: pulseAnim }] }]}>
          <View style={styles.glassCircle}>
            <Search color="#00BDD6" size={48} strokeWidth={2.5} />
          </View>
        </Animated.View>

        {/* ── Step Progress Indicator (Page 9 PDF) ── */}
        <View style={styles.progressContainer}>
          <StepProgress currentStatus={activeOrder?.status || 'look_for_driver'} />
        </View>

        {/* ── Buttons (Page 9 PDF) ── */}
        <View style={styles.bottomButtons}>
          <TouchableOpacity
            style={styles.needHelpBtn}
            activeOpacity={0.8}
            onPress={() => router.push('/ai-chat')}
          >
            <Text style={styles.needHelpText}>Need help?</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.cancelBtn}
            activeOpacity={0.7}
            onPress={handleCancel}
          >
            <X color="#6C757D" size={16} />
            <Text style={styles.cancelText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingVertical: 30,
  },
  statusBadge: {
    alignItems: 'center',
    gap: 8,
    marginTop: 20,
  },
  statusText: {
    fontSize: 14,
    color: Colors.textSecondary,
    fontWeight: '500',
  },
  mainTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: Colors.text,
    marginTop: -20,
  },
  glassWrapper: {
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: '#E0F8FB',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 20,
  },
  glassCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: '#00BDD6',
  },
  progressContainer: {
    width: '100%',
    paddingHorizontal: 8,
  },
  bottomButtons: {
    width: '100%',
    alignItems: 'center',
    gap: 16,
    marginBottom: 10,
  },
  needHelpBtn: {
    width: '100%',
    height: 48,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: '#00BDD6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  needHelpText: {
    color: '#00BDD6',
    fontSize: 15,
    fontWeight: '700',
  },
  cancelBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    padding: 8,
  },
  cancelText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6C757D',
  },
});
