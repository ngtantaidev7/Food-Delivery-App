import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { User, Volume2, MicOff, PhoneOff } from 'lucide-react-native';
import Colors from '@/constants/colors';

export default function DriverCallScreen() {
  const router = useRouter();
  const { driverId } = useLocalSearchParams<{ driverId: string }>();

  const [seconds, setSeconds] = useState(29);
  const [isSpeaker, setIsSpeaker] = useState(false);
  const [isMute, setIsMute] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setSeconds((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTimer = (sec: number) => {
    const mins = Math.floor(sec / 60);
    const rem = sec % 60;
    return `${mins.toString().padStart(2, '0')}:${rem.toString().padStart(2, '0')}`;
  };

  const handleEndCall = () => {
    router.back();
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      {/* ── Top Info (Page 13 PDF) ── */}
      <View style={styles.topInfo}>
        <Text style={styles.title}>Driver</Text>
        <Text style={styles.timerText}>{formatTimer(seconds)}</Text>
      </View>

      {/* ── Avatar (Page 13 PDF) ── */}
      <View style={styles.avatarSection}>
        <View style={styles.avatarCircle}>
          <User color="#FFFFFF" size={54} strokeWidth={2} />
        </View>
      </View>

      {/* ── Controls (Page 13 PDF) ── */}
      <View style={styles.controlsSection}>
        <View style={styles.optionsRow}>
          <View style={styles.controlItem}>
            <TouchableOpacity
              style={[styles.controlCircleBtn, isSpeaker && styles.controlActive]}
              activeOpacity={0.8}
              onPress={() => setIsSpeaker(!isSpeaker)}
            >
              <Volume2 color={isSpeaker ? '#00BDD6' : '#1E2022'} size={24} />
            </TouchableOpacity>
            <Text style={styles.controlLabel}>Speaker</Text>
          </View>

          <View style={styles.controlItem}>
            <TouchableOpacity
              style={[styles.controlCircleBtn, isMute && styles.controlActive]}
              activeOpacity={0.8}
              onPress={() => setIsMute(!isMute)}
            >
              <MicOff color={isMute ? '#00BDD6' : '#1E2022'} size={24} />
            </TouchableOpacity>
            <Text style={styles.controlLabel}>Mute</Text>
          </View>
        </View>

        {/* Big Red End Call Button (Page 13 PDF) */}
        <TouchableOpacity
          style={styles.endCallBtn}
          activeOpacity={0.85}
          onPress={handleEndCall}
        >
          <PhoneOff color="#FFFFFF" size={28} />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    justifyContent: 'space-between',
    paddingVertical: 40,
    paddingHorizontal: 24,
  },
  topInfo: {
    alignItems: 'center',
    marginTop: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    color: Colors.text,
  },
  timerText: {
    fontSize: 15,
    color: Colors.textSecondary,
    marginTop: 8,
    fontWeight: '500',
  },
  avatarSection: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#00BDD6',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#00BDD6',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 8,
  },
  controlsSection: {
    alignItems: 'center',
    marginBottom: 20,
  },
  optionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginBottom: 36,
  },
  controlItem: {
    alignItems: 'center',
    gap: 8,
  },
  controlCircleBtn: {
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  controlActive: {
    backgroundColor: '#E0F8FB',
    borderWidth: 1.5,
    borderColor: '#00BDD6',
  },
  controlLabel: {
    fontSize: 13,
    color: Colors.text,
    fontWeight: '600',
  },
  endCallBtn: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: '#FF4D4F',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#FF4D4F',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
});
