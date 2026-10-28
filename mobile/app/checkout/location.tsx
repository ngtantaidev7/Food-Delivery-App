import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { ArrowLeft, MapPin, Pencil } from 'lucide-react-native';
import Colors from '@/constants/colors';

const { width, height } = Dimensions.get('window');

type AddressType = 'Home' | 'Work' | 'Other';

export default function SelectLocationScreen() {
  const router = useRouter();
  const [address, setAddress] = useState('201 Katlian No.21 Street');
  const [addressType, setAddressType] = useState<AddressType>('Home');
  const [isEditing, setIsEditing] = useState(false);

  const handleConfirm = () => {
    router.back();
  };

  return (
    <View style={styles.container}>
      {/* ── Mock Map View with Roads & Center Pin (Page 7 PDF) ── */}
      <View style={styles.mapCanvas}>
        {/* Mock road grid lines */}
        <View style={[styles.roadLine, { top: '25%', left: 0, right: 0, transform: [{ rotate: '-12deg' }] }]} />
        <View style={[styles.roadLine, { top: '45%', left: 0, right: 0, transform: [{ rotate: '8deg' }] }]} />
        <View style={[styles.roadLine, { top: 0, bottom: 0, left: '35%', width: 24, transform: [{ rotate: '25deg' }] }]} />
        <View style={[styles.roadLine, { top: 0, bottom: 0, right: '25%', width: 20, transform: [{ rotate: '-15deg' }] }]} />

        {/* POI icons on map */}
        <View style={[styles.poiBadge, { top: '35%', left: '15%' }]}>
          <Text style={styles.poiText}>🏪</Text>
        </View>
        <View style={[styles.poiBadge, { top: '28%', right: '20%' }]}>
          <Text style={styles.poiText}>🛒</Text>
        </View>
        <View style={[styles.poiBadge, { top: '42%', right: '26%' }]}>
          <Text style={styles.poiText}>🏠</Text>
        </View>

        {/* Big Cyan Center Pin (Page 7 PDF) */}
        <View style={styles.centerPinWrapper}>
          <View style={styles.centerPinCircle}>
            <View style={styles.centerPinDot} />
          </View>
          <View style={styles.centerPinShadow} />
        </View>

        {/* Street labels */}
        <Text style={[styles.streetLabel, { top: '22%', left: '26%', transform: [{ rotate: '-65deg' }] }]}>
          street name
        </Text>
        <Text style={[styles.streetLabel, { top: '53%', right: '15%', transform: [{ rotate: '-10deg' }] }]}>
          street name
        </Text>
        <Text style={[styles.streetLabel, { top: '32%', left: '2%', transform: [{ rotate: '0deg' }] }]}>
          REET
        </Text>
      </View>

      {/* ── Top Back Button ── */}
      <SafeAreaView style={styles.topBar} edges={['top']}>
        <TouchableOpacity
          style={styles.backCircleBtn}
          onPress={() => router.back()}
          activeOpacity={0.8}
        >
          <ArrowLeft color="#1E2022" size={20} />
        </TouchableOpacity>
      </SafeAreaView>

      {/* ── Bottom Sheet (Page 7 PDF) ── */}
      <View style={styles.bottomSheet}>
        <Text style={styles.sheetTitle}>Select location</Text>

        <View style={styles.addressRow}>
          {isEditing ? (
            <TextInput
              value={address}
              onChangeText={setAddress}
              style={styles.addressInput}
              autoFocus
              onBlur={() => setIsEditing(false)}
            />
          ) : (
            <Text style={styles.addressText} numberOfLines={1}>
              {address}
            </Text>
          )}

          <TouchableOpacity
            onPress={() => setIsEditing(!isEditing)}
            style={styles.pencilBtn}
          >
            <Pencil color={Colors.textSecondary} size={18} />
          </TouchableOpacity>
        </View>

        <View style={styles.divider} />

        {/* Radio options: Home, Work, Other */}
        <View style={styles.radioGroup}>
          {(['Home', 'Work', 'Other'] as AddressType[]).map((type) => {
            const isSelected = addressType === type;
            return (
              <TouchableOpacity
                key={type}
                style={styles.radioItem}
                activeOpacity={0.7}
                onPress={() => setAddressType(type)}
              >
                <View style={[styles.radioCircle, isSelected && styles.radioCircleActive]}>
                  {isSelected && <View style={styles.radioInner} />}
                </View>
                <Text style={styles.radioText}>{type}</Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Confirm Button (Page 7 PDF) */}
        <TouchableOpacity
          style={styles.confirmBtn}
          activeOpacity={0.9}
          onPress={handleConfirm}
        >
          <Text style={styles.confirmText}>Confirm</Text>
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
  mapCanvas: {
    ...StyleSheet.absoluteFill as any,
    backgroundColor: '#F5F6F8',
    overflow: 'hidden',
  },
  roadLine: {
    position: 'absolute',
    height: 18,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#E8ECF0',
  },
  streetLabel: {
    position: 'absolute',
    fontSize: 9,
    color: '#B0BAC5',
    fontWeight: '600',
  },
  poiBadge: {
    position: 'absolute',
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
  },
  poiText: {
    fontSize: 14,
  },
  centerPinWrapper: {
    position: 'absolute',
    top: '40%',
    left: '50%',
    marginLeft: -25,
    marginTop: -25,
    alignItems: 'center',
  },
  centerPinCircle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#00BDD6',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: 'rgba(255,255,255,0.7)',
    shadowColor: '#00BDD6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  centerPinDot: {
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: '#FFFFFF',
  },
  centerPinShadow: {
    width: 28,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(0,189,214,0.2)',
    marginTop: 6,
  },
  topBar: {
    position: 'absolute',
    top: 0,
    left: 0,
    paddingHorizontal: 16,
    paddingTop: 10,
  },
  backCircleBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#EEEEEE',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  bottomSheet: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 28,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 10,
  },
  sheetTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: Colors.text,
    marginBottom: 16,
  },
  addressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 6,
  },
  addressText: {
    fontSize: 15,
    fontWeight: '600',
    color: Colors.text,
    flex: 1,
  },
  addressInput: {
    fontSize: 15,
    fontWeight: '600',
    color: Colors.text,
    flex: 1,
    borderBottomWidth: 1,
    borderBottomColor: '#00BDD6',
    paddingVertical: 2,
  },
  pencilBtn: {
    padding: 6,
    marginLeft: 8,
  },
  divider: {
    height: 1,
    backgroundColor: '#F3F4F6',
    marginVertical: 14,
  },
  radioGroup: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  radioItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  radioCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: '#D1D5DB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioCircleActive: {
    borderColor: '#00BDD6',
  },
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#00BDD6',
  },
  radioText: {
    fontSize: 14,
    color: Colors.text,
    fontWeight: '500',
  },
  confirmBtn: {
    backgroundColor: '#00BDD6',
    borderRadius: 10,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
  confirmText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
});
